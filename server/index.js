const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://keerthivasan:keerthivasan123456789@cluster0.cjc3t9h.mongodb.net/leonux-ai?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const chatSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  title: { type: String, default: 'New Chat' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

const messageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed }
});

const Message = mongoose.model('Message', messageSchema);

app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    message: 'Leonux AI Backend is running',
    mongodb: mongoStatus,
    hasApiKey: !!process.env.OPENROUTER_API_KEY
  });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    let user = await User.findOne({ email });
    if (user) {
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = new User({ name, email });
      await user.save();
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login user' });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const { userId, userEmail, title } = req.body;
    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'User ID and email are required' });
    }
    const session = new ChatSession({ userId, userEmail, title: title || 'New Chat' });
    await session.save();
    res.json({ success: true, session });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

app.get('/api/sessions/user/:email', async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userEmail: req.params.email }).sort({ updatedAt: -1 });
    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to get chat sessions' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { sessionId, role, content, metadata } = req.body;
    if (!sessionId || !role || !content) {
      return res.status(400).json({ error: 'Session ID, role, and content are required' });
    }
    const message = new Message({ sessionId, role, content, metadata });
    await message.save();
    await ChatSession.findByIdAndUpdate(sessionId, { updatedAt: new Date() });
    res.json({ success: true, message });
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.get('/api/messages/session/:sessionId', async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.sessionId }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

app.delete('/api/sessions/:sessionId', async (req, res) => {
  try {
    await Message.deleteMany({ sessionId: req.params.sessionId });
    await ChatSession.findByIdAndDelete(req.params.sessionId);
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

app.post('/api/chat', (req, res) => {
  console.log('📨 Chat request received');
  const { messages, model } = req.body;
  const API_KEY = process.env.OPENROUTER_API_KEY;
  
  if (!API_KEY) {
    console.error('❌ API key not found');
    return res.status(500).json({ error: 'API key not configured' });
  }

  console.log('✅ API key found, making request to OpenRouter...');

  const data = JSON.stringify({
    model: model || 'deepseek/deepseek-chat',
    messages: messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 1024
  });

  const options = {
    hostname: 'openrouter.ai',
    path: '/api/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'Authorization': 'Bearer ' + API_KEY,
      'HTTP-Referer': 'https://www.leonux.online/',
      'X-Title': 'Leonux AI'
    }
  };

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const proxyReq = https.request(options, (proxyRes) => {
    console.log('✅ OpenRouter responded with status:', proxyRes.statusCode);
    
    let responseData = '';
    proxyRes.on('data', (chunk) => {
      responseData += chunk.toString();
      console.log('📦 Received chunk:', chunk.toString().substring(0, 100));
    });
    
    proxyRes.on('end', () => {
      console.log('✅ Stream ended. Total data length:', responseData.length);
    });
    
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (error) => {
    console.error('❌ Proxy error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to connect to AI service' });
    }
  });

  proxyReq.write(data);
  proxyReq.end();
});

app.listen(PORT, () => {
  console.log('🚀 Leonux AI Backend running on port ' + PORT);
  console.log('📊 API: http://localhost:' + PORT + '/api');
});

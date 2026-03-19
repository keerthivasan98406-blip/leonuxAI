const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' })); // Increased from default 100kb to support large images
app.use(express.urlencoded({ limit: '25mb', extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://keerthivasan:keerthivasan123456789@cluster0.cjc3t9h.mongodb.net/leonux-ai?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {})
.catch(err => {});

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
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

app.get('/api/sessions/user/:email', async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userEmail: req.params.email }).sort({ updatedAt: -1 });
    res.json({ sessions });
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.get('/api/messages/session/:sessionId', async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.sessionId }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

app.delete('/api/sessions/:sessionId', async (req, res) => {
  try {
    await Message.deleteMany({ sessionId: req.params.sessionId });
    await ChatSession.findByIdAndDelete(req.params.sessionId);
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

app.post('/api/chat', (req, res) => {
  const { messages, model } = req.body;
  
  // Check if request contains images
  const hasImages = messages.some(m => 
    Array.isArray(m.content) && m.content.some(c => c.type === 'image_url')
  );
  
  const API_KEY = process.env.OPENROUTER_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const data = JSON.stringify({
    model: model || 'google/gemma-3-27b-it:free',
    messages: messages,
    stream: true,
    temperature: 0.5,  // Reduced from 0.7 for faster, more focused responses
    max_tokens: 1500,  // Reduced from 2048 for faster responses
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0
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
    if (proxyRes.statusCode !== 200) {
      let errorData = '';
      proxyRes.on('data', (chunk) => {
        errorData += chunk.toString();
      });
      proxyRes.on('end', () => {
        if (!res.headersSent) {
          res.status(proxyRes.statusCode).json({ error: errorData });
        }
      });
      return;
    }
    
    // Pipe the response directly
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (error) => {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to connect to AI service' });
    }
  });

  proxyReq.write(data);
  proxyReq.end();
});

app.listen(PORT, () => {});

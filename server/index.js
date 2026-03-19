const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = [
  'https://leonuxai.online',
  'https://www.leonuxai.online',
  'https://leonuxai-3.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Handle CORS manually so it works even on 502/error responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://leonuxai.online');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://keerthivasan:keerthivasan123456789@cluster0.cjc3t9h.mongodb.net/leonux-ai?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('[DB] MongoDB connected'))
  .catch(err => console.error('[DB] MongoDB error:', err.message));

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
  res.json({
    status: 'OK',
    message: 'Leonux AI Backend is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    hasApiKey: !!process.env.OPENROUTER_API_KEY
  });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
    let user = await User.findOne({ email });
    if (user) { user.lastLogin = new Date(); await user.save(); }
    else { user = new User({ name, email }); await user.save(); }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login user' });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const { userId, userEmail, title } = req.body;
    if (!userId || !userEmail) return res.status(400).json({ error: 'User ID and email are required' });
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
    if (!sessionId || !role || !content) return res.status(400).json({ error: 'Session ID, role, and content are required' });
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

const MODEL = 'google/gemma-3-27b-it:free';

function callOpenRouter(messages) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
      temperature: 0.5,
      max_tokens: 800,
      top_p: 0.9,
    });
    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
        'HTTP-Referer': 'https://leonuxai.online/',
        'X-Title': 'Leonux AI'
      }
    };
    const req = https.request(options, (proxyRes) => {
      console.log(`[OpenRouter] status=${proxyRes.statusCode}`);
      resolve({ statusCode: proxyRes.statusCode, proxyRes });
    });
    req.on('error', (err) => {
      console.error('[OpenRouter] error:', err.message);
      resolve({ statusCode: 500, proxyRes: null });
    });
    req.setTimeout(25000, () => {
      console.error('[OpenRouter] timeout');
      req.destroy();
      resolve({ statusCode: 504, proxyRes: null });
    });
    req.write(data);
    req.end();
  });
}

app.post('/api/chat', async (req, res) => {
  const API_KEY = process.env.OPENROUTER_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

  const { messages } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const { statusCode, proxyRes } = await callOpenRouter(messages);

    if (statusCode === 200 && proxyRes) {
      proxyRes.on('error', (err) => {
        console.error('[Chat] stream error:', err.message);
        if (!res.writableEnded) res.end();
      });
      proxyRes.pipe(res);
      return;
    }

    // Log error body
    if (proxyRes) {
      let body = '';
      proxyRes.on('data', c => body += c);
      proxyRes.on('end', () => console.error(`[Chat] OpenRouter ${statusCode}:`, body));
    }
  } catch (err) {
    console.error('[Chat] exception:', err.message);
  }

  if (!res.writableEnded) {
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: 'Service temporarily unavailable. Please try again in a moment.' } }] })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));

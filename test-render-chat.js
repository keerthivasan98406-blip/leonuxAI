// Test the Render backend chat endpoint
import https from 'https';

const data = JSON.stringify({
  model: 'deepseek/deepseek-chat',
  messages: [
    { role: 'user', content: 'Say hello in one word' }
  ],
  stream: true
});

const options = {
  hostname: 'leonuxai-2.onrender.com',
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('🚀 Testing Render backend chat endpoint...');

const req = https.request(options, (res) => {
  console.log('✅ Status:', res.statusCode);
  console.log('📋 Headers:', res.headers);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    const chunkStr = chunk.toString();
    responseData += chunkStr;
    console.log('📦 Chunk received:', chunkStr.substring(0, 200));
  });
  
  res.on('end', () => {
    console.log('\n✅ Response complete');
    console.log('📊 Total length:', responseData.length);
    console.log('📄 Full response:', responseData.substring(0, 500));
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error);
});

req.write(data);
req.end();

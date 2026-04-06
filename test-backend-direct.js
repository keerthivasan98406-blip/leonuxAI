// Test the backend directly to see what's being returned
import https from 'https';

const data = JSON.stringify({
  model: 'deepseek/deepseek-chat',
  messages: [
    { role: 'user', content: 'Say hello in one word' }
  ],
  stream: true
});

const options = {
  hostname: 'leonuxai-3.onrender.com',
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('🚀 Testing backend at: https://leonuxai-3.onrender.com/api/chat');
console.log('📤 Sending request...\n');

const req = https.request(options, (res) => {
  console.log('✅ Status:', res.statusCode);
  console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
  console.log('\n📦 Response chunks:\n');
  
  let chunkCount = 0;
  let totalLength = 0;
  
  res.on('data', (chunk) => {
    chunkCount++;
    const chunkStr = chunk.toString();
    totalLength += chunkStr.length;
    console.log(`Chunk ${chunkCount} (${chunkStr.length} bytes):`);
    console.log(chunkStr);
    console.log('---');
  });
  
  res.on('end', () => {
    console.log('\n✅ Response complete');
    console.log(`📊 Total chunks: ${chunkCount}`);
    console.log(`📊 Total bytes: ${totalLength}`);
    
    if (totalLength === 0) {
      console.log('\n❌ ERROR: Response is empty!');
      console.log('This means the backend is not returning any data.');
      console.log('Check backend logs on Render for errors.');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.write(data);
req.end();

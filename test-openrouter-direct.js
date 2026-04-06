// Test OpenRouter API directly to verify it's working
import https from 'https';

const API_KEY = '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';

const data = JSON.stringify({
  model: 'deepseek/deepseek-chat',
  messages: [
    { role: 'user', content: 'Say hello in one word' }
  ],
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
    'Authorization': `Bearer ${API_KEY}`,
    'HTTP-Referer': 'https://www.leonux.online/',
    'X-Title': 'Leonux AI'
  }
};

console.log('🚀 Testing OpenRouter API directly...');
console.log('📤 Sending request to openrouter.ai\n');

const req = https.request(options, (res) => {
  console.log('✅ Status:', res.statusCode);
  console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
  console.log('\n📦 Response chunks:\n');
  
  let chunkCount = 0;
  let totalLength = 0;
  let fullResponse = '';
  
  res.on('data', (chunk) => {
    chunkCount++;
    const chunkStr = chunk.toString();
    totalLength += chunkStr.length;
    fullResponse += chunkStr;
    console.log(`Chunk ${chunkCount} (${chunkStr.length} bytes):`);
    console.log(chunkStr.substring(0, 200));
    console.log('---');
  });
  
  res.on('end', () => {
    console.log('\n✅ Response complete');
    console.log(`📊 Total chunks: ${chunkCount}`);
    console.log(`📊 Total bytes: ${totalLength}`);
    
    if (totalLength === 0) {
      console.log('\n❌ ERROR: OpenRouter returned empty response!');
      console.log('Possible causes:');
      console.log('1. API key is invalid or expired');
      console.log('2. API key has no credits');
      console.log('3. Model is not available');
      console.log('4. OpenRouter service is down');
    } else {
      console.log('\n✅ SUCCESS: OpenRouter is working!');
      console.log('Full response preview:');
      console.log(fullResponse.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.write(data);
req.end();

// Test the new API key
import https from 'https';

const API_KEY = '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';

const data = JSON.stringify({
  model: 'deepseek/deepseek-chat',
  messages: [
    { role: 'user', content: 'Say hello in one word' }
  ],
  stream: true
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

console.log('🧪 Testing new API key...\n');

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  
  if (res.statusCode === 200) {
    console.log('✅ SUCCESS! API key is valid!\n');
    let data = '';
    res.on('data', (chunk) => {
      data += chunk.toString();
    });
    res.on('end', () => {
      console.log('Response preview:', data.substring(0, 200));
      console.log('\n✅ API key is working! Updating configuration...');
    });
  } else if (res.statusCode === 401) {
    console.log('❌ FAILED! API key is still invalid.');
    res.on('data', (chunk) => {
      console.log('Error:', chunk.toString());
    });
  } else {
    console.log('⚠️  Unexpected status:', res.statusCode);
    res.on('data', (chunk) => {
      console.log('Response:', chunk.toString());
    });
  }
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.write(data);
req.end();

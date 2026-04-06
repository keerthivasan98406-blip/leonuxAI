const https = require('https');

const API_KEY = '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';

const data = JSON.stringify({
  model: 'deepseek/deepseek-chat',
  messages: [
    { role: 'user', content: 'Say hello' }
  ],
  max_tokens: 50
});

const options = {
  hostname: 'openrouter.ai',
  path: '/api/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'HTTP-Referer': 'https://www.leonux.online/',
    'X-Title': 'Leonux AI Test'
  }
};

console.log('Testing API key:', API_KEY.substring(0, 20) + '...');

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', body.substring(0, 500));
    if (res.statusCode === 200) {
      console.log('✅ API key is VALID');
    } else if (res.statusCode === 401) {
      console.log('❌ API key is INVALID - User not found');
    } else if (res.statusCode === 402) {
      console.log('⚠️ API key is valid but out of credits');
    } else {
      console.log('❓ Unexpected status code');
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.write(data);
req.end();

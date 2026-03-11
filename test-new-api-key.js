// Test a new API key before deploying
import https from 'https';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║           OpenRouter API Key Tester                           ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

rl.question('Enter your OpenRouter API key: ', (apiKey) => {
  if (!apiKey || !apiKey.startsWith('sk-or-v1-')) {
    console.log('\n❌ Invalid API key format. Should start with: sk-or-v1-');
    rl.close();
    return;
  }

  console.log('\n🚀 Testing API key...\n');

  const data = JSON.stringify({
    model: 'deepseek/deepseek-chat',
    messages: [
      { role: 'user', content: 'Say hello' }
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
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://www.leonux.online/',
      'X-Title': 'Leonux AI'
    }
  };

  const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk.toString();
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('\n✅ SUCCESS! API key is valid and working!');
        console.log('Response preview:', responseData.substring(0, 200));
        console.log('\n📝 Next steps:');
        console.log('1. Update server/.env with this key');
        console.log('2. Update Render environment variable OPENROUTER_API_KEY');
        console.log('3. Redeploy backend on Render');
      } else if (res.statusCode === 401) {
        console.log('\n❌ FAILED: API key is invalid or expired');
        console.log('Error:', responseData);
        console.log('\n📝 What to do:');
        console.log('1. Go to https://openrouter.ai/');
        console.log('2. Sign in to your account');
        console.log('3. Go to Keys section');
        console.log('4. Create a new API key');
        console.log('5. Make sure you have credits');
      } else {
        console.log('\n⚠️  Unexpected response:', res.statusCode);
        console.log('Response:', responseData);
      }
      rl.close();
    });
  });

  req.on('error', (error) => {
    console.error('\n❌ Request error:', error);
    rl.close();
  });

  req.write(data);
  req.end();
});

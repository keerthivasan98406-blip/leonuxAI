// Simple script to start the server from root directory
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Leonux AI Backend...');
console.log('📁 Server directory:', path.join(__dirname, 'server'));

const serverProcess = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  env: process.env
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

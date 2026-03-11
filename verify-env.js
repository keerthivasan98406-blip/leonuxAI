// Verify environment variables are set correctly
console.log('='.repeat(60));
console.log('ENVIRONMENT VARIABLE CHECK');
console.log('='.repeat(60));
console.log('');
console.log('VITE_API_URL:', process.env.VITE_API_URL || 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('');
console.log('Expected: VITE_API_URL=https://leonuxai-2.onrender.com/api');
console.log('');

if (!process.env.VITE_API_URL) {
  console.log('❌ WARNING: VITE_API_URL is not set!');
  console.log('   The frontend will use the default: http://localhost:5000/api');
  console.log('   This will cause empty responses on deployed version.');
  console.log('');
  console.log('   FIX: Set VITE_API_URL in Render environment variables');
} else if (process.env.VITE_API_URL.includes('localhost')) {
  console.log('❌ WARNING: VITE_API_URL points to localhost!');
  console.log('   This will not work on deployed version.');
} else {
  console.log('✅ VITE_API_URL is set correctly!');
}

console.log('='.repeat(60));

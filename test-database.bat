@echo off
echo Testing Database Connection...
cd server
node -e "const mongoose = require('mongoose'); const uri = 'mongodb+srv://leonuxfounder_db_user:1afeZbdsZC9wONCp@cluster0.17z10aw.mongodb.net/leonux-ai?retryWrites=true&w=majority'; mongoose.connect(uri).then(() => { console.log('✅ MongoDB Connected Successfully'); process.exit(0); }).catch(err => { console.error('❌ Connection Error:', err.message); process.exit(1); });"
pause

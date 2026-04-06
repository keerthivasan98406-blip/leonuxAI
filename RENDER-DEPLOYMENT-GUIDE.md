# Render Deployment Guide - Fix Mobile Issue

## Problem
Mobile can't access the AI because the backend is not deployed online.

## Solution
Deploy the backend to Render so both mobile and desktop can access it.

## Step-by-Step Instructions

### 1. Create Backend Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → Select **"Web Service"**
3. Connect your GitHub repository: `keerthivasan98406-blip/leonuxAI`
4. Click **"Connect"**

### 2. Configure Backend Service

Fill in these EXACT settings:

- **Name:** `leonux-ai-backend`
- **Region:** Singapore (or closest to you)
- **Branch:** `main`
- **Root Directory:** `server`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free

### 3. Add Environment Variables

Click **"Add Environment Variable"** for each:

**Variable 1:**
- Key: `OPENROUTER_API_KEY`
- Value: `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`

**Variable 2:**
- Key: `MONGODB_URI`
- Value: `mongodb+srv://keerthivasan:keerthivasan123456789@cluster0.cjc3t9h.mongodb.net/leonux-ai?retryWrites=true&w=majority`

**Variable 3:**
- Key: `PORT`
- Value: `10000`

### 4. Create Service

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Watch the logs - you should see: `🚀 Leonux AI Backend running on port 10000`

### 5. Get Your Backend URL

Once deployed, Render will give you a URL like:
- `https://leonux-ai-backend.onrender.com` OR
- `https://leonux-ai-backend-xxxx.onrender.com`

**Copy this URL!**

### 6. Update Frontend to Use Your Backend URL

1. Open `.env.local` file
2. Change `VITE_API_URL` to your actual backend URL + `/api`
   
   Example:
   ```
   VITE_API_URL=https://leonux-ai-backend-xxxx.onrender.com/api
   ```

3. Rebuild frontend:
   ```bash
   npm run build
   ```

4. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend URL"
   git push origin main
   ```

### 7. Test

**Test Backend:**
Open in browser: `https://your-backend-url.onrender.com/api/health`

Should show:
```json
{"status":"OK","message":"Leonux AI Backend is running"}
```

**Test Mobile:**
1. Wait for GitHub Pages to redeploy (2-3 minutes)
2. Open your site on mobile
3. Send a message - AI should respond!

## Troubleshooting

**If backend shows "Not Found":**
- Check Render logs for errors
- Make sure Root Directory is set to `server`
- Verify all environment variables are added

**If mobile still doesn't work:**
- Clear mobile browser cache
- Make sure you updated the correct backend URL in `.env.local`
- Rebuild and redeploy frontend

**If you see "502 Bad Gateway":**
- Backend is starting up (Render free tier sleeps)
- Wait 30 seconds and try again

## Important Notes

- ✅ API key is now secure on backend
- ✅ Mobile will work once backend is deployed
- ⚠️ Render free tier sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds to wake up

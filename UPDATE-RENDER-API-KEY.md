# Update API Key on Render - IMPORTANT

## New API Key
```
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
```

## Steps to Update on Render

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com/

### 2. Select Backend Service
- Click on "leonuxai-2" (your backend service)

### 3. Update Environment Variable
- Click "Environment" in the left sidebar
- Find `OPENROUTER_API_KEY`
- Click the edit icon (pencil)
- Replace the old key with the new key:
  ```
  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
  ```
- Click "Save Changes"

### 4. Redeploy (Automatic)
- Render will automatically redeploy with the new key
- Wait 2-3 minutes for deployment to complete

### 5. Test
- Go to https://leonuxai-3.onrender.com
- Send a test message
- Should work without 402 errors now

## What Was Updated

✅ Local file: `server/.env` (updated with latest key)
✅ Backend code: max_tokens set to 2048 (full responses)
⏳ **PENDING**: Update on Render dashboard (manual step above)

## Why Manual Update Needed

The `.env` file is in `.gitignore` (for security), so the API key doesn't get pushed to GitHub. You must update it manually on Render's dashboard.

## After Update

Once you update the key on Render:
- ✅ Full AI responses (2048 tokens)
- ✅ No more 402 credit errors
- ✅ Image analysis will work (20MB support)
- ✅ All features enabled

## Quick Access
1. Dashboard: https://dashboard.render.com/
2. Find your backend service (leonuxai-2)
3. Environment → Edit OPENROUTER_API_KEY
4. Save and wait for redeploy


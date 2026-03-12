# API Key Issue - 401 "User not found"

## Problem
Getting 401 error: "User not found" when trying to use the AI.

## Possible Causes

### 1. API Key Not Updated on Render (Most Likely)
The environment variable on Render still has the old API key.

**Solution:**
1. Go to https://dashboard.render.com/
2. Click "leonuxai-2" (backend service)
3. Click "Environment" tab
4. Find `OPENROUTER_API_KEY`
5. Click edit and update to: `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`
6. Click "Save Changes"
7. Wait 2-3 minutes for redeploy

### 2. Invalid API Key
The API key might be invalid or from a different account.

**To verify:**
1. Go to https://openrouter.ai/keys
2. Check if this key exists: `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`
3. Make sure it's not deleted or expired
4. Check if it has credits

### 3. Wrong OpenRouter Account
The API key might be from a different OpenRouter account.

**Solution:**
- Log into the correct OpenRouter account
- Generate a new API key
- Update both local `.env` and Render environment variable

## How to Check Render's Current API Key

1. Go to Render dashboard
2. Click "leonuxai-2"
3. Click "Environment"
4. Look at `OPENROUTER_API_KEY` value
5. Compare with: `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`

## How to Check Render Logs

1. Go to Render dashboard
2. Click "leonuxai-2"
3. Click "Logs" tab
4. Look for lines like:
   - `✅ API key found: sk-or-v1-f5444...`
   - `❌ OpenRouter responded with status: 401`

## Quick Fix Steps

**Option A: Update on Render (Recommended)**
1. Update `OPENROUTER_API_KEY` on Render dashboard
2. Wait for redeploy
3. Test

**Option B: Generate New Key**
1. Go to https://openrouter.ai/keys
2. Create new API key
3. Update in Render dashboard
4. Update in `server/.env` locally
5. Test

## Current Status
- ✅ Local `server/.env` has the key
- ✅ Code is on GitHub
- ❌ Render environment variable needs manual update
- ❓ Need to verify if key is valid on OpenRouter

## Next Step
**You must manually update the environment variable on Render dashboard.** This cannot be done automatically through code deployment.

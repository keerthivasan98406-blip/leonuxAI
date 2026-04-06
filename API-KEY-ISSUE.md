# API Key Issue - URGENT FIX NEEDED

## Problem Identified

The OpenRouter API key is returning `401 - User not found` error.

```json
{"error":{"message":"User not found.","code":401}}
```

This means:
- ❌ The API key is invalid or expired
- ❌ The account associated with the key doesn't exist
- ❌ The key has been revoked

## Current API Key (NOT WORKING)

```
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
```

## How to Fix

### Step 1: Get a New API Key

1. Go to https://openrouter.ai/
2. Sign in to your account (or create one if needed)
3. Go to the "Keys" section
4. Click "Create Key"
5. Copy the new API key (starts with `sk-or-v1-`)
6. **IMPORTANT**: Make sure your account has credits!

### Step 2: Test the New Key

Run this command and paste your new key:
```bash
node test-new-api-key.js
```

It will tell you if the key is valid before you deploy it.

### Step 3: Update Local Environment

Edit `server/.env` and replace the old key:
```
OPENROUTER_API_KEY=sk-or-v1-YOUR_NEW_KEY_HERE
```

### Step 4: Update Render Environment

1. Go to https://dashboard.render.com
2. Click on "leonux-ai-backend" service
3. Click "Environment" tab
4. Find `OPENROUTER_API_KEY`
5. Click "Edit"
6. Paste your new API key
7. Click "Save Changes"
8. Backend will automatically redeploy

### Step 5: Test

Wait 2-3 minutes for Render to redeploy, then:
```bash
node test-backend-direct.js
```

Should now show actual AI responses!

## Why This Happened

Possible reasons:
1. The API key was from a trial account that expired
2. The key was manually revoked
3. The account ran out of credits
4. The key was deleted from OpenRouter dashboard

## Alternative: Use a Different Model

If you can't get OpenRouter working, you could switch to:
- Google Gemini API (free tier available)
- OpenAI API (requires payment)
- Anthropic Claude API (requires payment)

But OpenRouter is the easiest since it's already integrated.

## Quick Check

To verify your OpenRouter account status:
1. Go to https://openrouter.ai/
2. Sign in
3. Check "Credits" section
4. Check "Keys" section - is your key listed?

## Files to Update

Once you have a new working key:
1. `server/.env` (local testing)
2. Render environment variables (production)
3. DO NOT commit the key to git!

## Test Script

Use `test-new-api-key.js` to test any new key before deploying:
```bash
node test-new-api-key.js
```

This will save you time by verifying the key works before updating Render.

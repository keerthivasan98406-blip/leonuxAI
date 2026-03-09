# 🚀 Deploy to Render

## Quick Setup

### Option 1: Using render.yaml (Recommended)

1. **Push the code to GitHub** (including the new `render.yaml` file)
   ```bash
   git add .
   git commit -m "Add Render configuration"
   git push origin main
   ```

2. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Click "New +" → "Web Service"

3. **Connect Repository**
   - Select your GitHub repository: `keerthivasan98406-blip/leonuxAI`
   - Render will automatically detect the `render.yaml` file

4. **Add Environment Variable**
   - In the Render dashboard, go to "Environment"
   - Add:
     - Key: `VITE_OPENROUTER_API_KEY`
     - Value: (your API key from `.env.local`)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)

---

### Option 2: Manual Configuration

If render.yaml doesn't work, configure manually:

1. **New Web Service**
   - Name: `leonux-ai`
   - Environment: `Static Site`
   - Branch: `main`

2. **Build Settings**
   - Root Directory: `.` (leave empty or use dot)
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Environment Variables**
   - Add `VITE_OPENROUTER_API_KEY` with your API key

4. **Advanced Settings**
   - Node Version: `20`
   - Auto-Deploy: `Yes`

---

## Troubleshooting

### Error: "Root directory 'server' does not exist"
**Solution**: 
- In Render dashboard, go to Settings
- Set "Root Directory" to `.` or leave it empty
- This is a frontend app, not a server app

### Error: "Build failed"
**Solution**:
- Make sure `VITE_OPENROUTER_API_KEY` is added in Environment Variables
- Check build logs for specific errors

### Site loads but shows blank page
**Solution**:
- Check if `dist` folder is being published
- Verify the base URL in `vite.config.ts` (should be `/` for Render)

---

## Render vs GitHub Pages

**Render:**
- ✅ Easier setup
- ✅ Custom domains
- ✅ Better for production
- ✅ Automatic HTTPS
- ❌ Free tier has limits

**GitHub Pages:**
- ✅ Complete
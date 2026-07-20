# Nür Capital — Deployment Guide

## Batched Deployment Strategy

To conserve Netlify build credits, we no longer auto-deploy on every git push.

## Workflow

1. Develop and commit changes locally or via Kiro
2. Test with `npm run dev` (local dev server)
3. When ready to deploy a batch of changes:
   - Ensure all changes are committed and pushed to main
   - Trigger deploy manually (see below)

## Manual Deploy Options

### Option A: Build Hook (Recommended — fastest)

```bash
curl -X POST https://api.netlify.com/build_hooks/6a5de35f9933b7286eb2bb66
```

Run this in any terminal (Git Bash, PowerShell, or Kiro terminal) to trigger a build.

### Option B: Netlify Dashboard

1. Go to https://app.netlify.com
2. Click your site (harmonious-croissant-052df9)
3. Go to Deploys
4. Click "Trigger deploy" → "Deploy site"

### Option C: Ask Kiro to deploy

Say: "Deploy to Netlify" and Kiro will run the build hook command for you.

## Important Notes

- Auto-deploy is **disabled** — pushing to GitHub does NOT trigger a build
- You must manually trigger a deploy when you want changes live
- Batch multiple changes together before deploying to conserve credits
- Backend (Render) still auto-deploys on push (free tier, no credit limit)

## URLs

- **Frontend:** https://harmonious-croissant-052df9.netlify.app
- **Backend:** https://nurcapital-api.onrender.com
- **GitHub:** https://github.com/taher88noor-create/nurcapital

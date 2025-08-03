# Vercel Deployment Guide

## Quick Deployment Steps

### Option 1: Frontend Only on Vercel (Recommended)

1. **Deploy Frontend on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository `Notookk/Devlancer`
   - Vercel will auto-detect it's a React app
   - Set **Root Directory** to `client`
   - Deploy

2. **Deploy Backend Separately:**
   - Use Railway, Render, or Heroku
   - Point to the `backend` folder
   - Set environment variables (MONGO_URI, JWT_SECRET)

### Option 2: Use Vercel Configuration (Current Setup)

The `vercel.json` in the root is configured to build the frontend from the `client` directory.

## Environment Variables Needed

For backend deployment:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

## Update API URLs

After deploying backend, update the API URL in:
`client/src/config/config.js`

Replace `https://your-backend-url.herokuapp.com/api` with your actual backend URL.

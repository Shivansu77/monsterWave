# Deployment Guide - Habit Tracker on Vercel

This guide will walk you through deploying both the **Backend (API)** and **Frontend** of your Habit Tracker application on Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a free MongoDB database at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
3. **Git Repository**: Your code should be pushed to GitHub, GitLab, or Bitbucket
4. **Vercel CLI** (optional): Install via `npm install -g vercel`

---

## Step 1: Set Up MongoDB Atlas

Before deploying, you need a production MongoDB database:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (choose the free tier)
3. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Save the username and password
4. Whitelist all IP addresses:
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (0.0.0.0/0)
   - This is needed for Vercel's serverless functions
5. Get your connection string:
   - Go to **Database** → **Connect** → **Connect your application**
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add your database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/habittracker`

---

## Step 2: Deploy Backend to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New..." → "Project"**
   - Import your GitHub repository
   - Vercel will detect it as a monorepo

3. **Configure Backend Project**:
   - **Project Name**: `habit-tracker-backend` (or any name you prefer)
   - **Framework Preset**: Other
   - **Root Directory**: Click **"Edit"** and select `Backend`
   - **Build Command**: Leave empty or use `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   Click **"Environment Variables"** and add:
   - `MONGODB_URI`: Your MongoDB connection string from Step 1
   - `JWT_SECRET`: A random secure string (e.g., `openssl rand -base64 32` in terminal)
   - `FRONTEND_URL`: Leave empty for now, we'll update it after deploying frontend

5. **Deploy**: Click **"Deploy"**

6. **Save Backend URL**: After deployment completes, copy your backend URL (e.g., `https://habit-tracker-backend.vercel.app`)

### Option B: Deploy via Vercel CLI

```bash
# Navigate to project root
cd /Users/bishtshivansugmail.com/Desktop/habitTracker

# Login to Vercel
vercel login

# Deploy backend
cd Backend
vercel --prod

# Follow prompts and add environment variables when asked
```

---

## Step 3: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Import Frontend as New Project**:
   - Go back to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New..." → "Project"**
   - Import the **same GitHub repository** again
   - This time we'll configure it for the frontend

2. **Configure Frontend Project**:
   - **Project Name**: `habit-tracker-frontend` (or any name you prefer)
   - **Framework Preset**: Vite
   - **Root Directory**: Click **"Edit"** and select `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**:
   Click **"Environment Variables"** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL from Step 2 (e.g., `https://habit-tracker-backend.vercel.app`)

4. **Deploy**: Click **"Deploy"**

5. **Save Frontend URL**: After deployment, copy your frontend URL (e.g., `https://habit-tracker-frontend.vercel.app`)

### Option B: Deploy via Vercel CLI

```bash
# Navigate to frontend directory
cd Frontend

# Create .env.production file
echo "VITE_API_URL=https://your-backend-url.vercel.app" > .env.production

# Deploy
vercel --prod
```

---

## Step 4: Update Backend CORS Settings

Now that you have your frontend URL, update the backend environment variables:

1. Go to your **Backend project** in Vercel dashboard
2. Navigate to **Settings → Environment Variables**
3. Add or update:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your frontend URL (e.g., `https://habit-tracker-frontend.vercel.app`)
4. Go to **Deployments** tab
5. Click the **three dots** on the latest deployment → **Redeploy**
6. Select **"Use existing Build Cache"** and click **"Redeploy"**

---

## Step 5: Test Your Deployment

1. Visit your frontend URL: `https://habit-tracker-frontend.vercel.app`
2. Try to register a new account
3. Login and create a habit
4. Test the habit tracking functionality

---

## Step 6: Custom Domain (Optional)

If you want to use custom domains:

1. Go to each project's **Settings → Domains**
2. Add your custom domain (e.g., `habittracker.com` for frontend, `api.habittracker.com` for backend)
3. Follow DNS configuration instructions
4. Update environment variables accordingly

---

## Troubleshooting

### Backend Issues

**Problem**: 500 Error or API not responding
- **Solution**: Check Vercel logs (Functions tab) for errors
- Verify MongoDB connection string is correct
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**Problem**: CORS errors
- **Solution**: Make sure `FRONTEND_URL` environment variable is set correctly
- Redeploy backend after updating environment variables

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check that `VITE_API_URL` points to correct backend URL
- Open browser console to see specific errors
- Ensure backend URL doesn't have trailing slash

**Problem**: Blank page or build errors
- **Solution**: Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`

### Database Issues

**Problem**: Cannot connect to database
- **Solution**: 
  - Verify MongoDB connection string format
  - Check username and password are correct
  - Ensure IP whitelist includes 0.0.0.0/0
  - Check database name is included in connection string

---

## Environment Variables Summary

### Backend Environment Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habittracker
JWT_SECRET=your-strong-random-secret-key
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=5000
```

### Frontend Environment Variables
```
VITE_API_URL=https://your-backend-url.vercel.app
```

---

## Important Notes

1. **Serverless Functions**: Vercel deploys the backend as serverless functions, which have a 10-second timeout on the free plan
2. **Cold Starts**: First request after inactivity may be slower
3. **Environment Variables**: Changes require redeployment to take effect
4. **Build Logs**: Always check build and function logs for errors
5. **Free Plan Limits**: Monitor your usage on Vercel dashboard

---

## Continuous Deployment

Once set up, any push to your GitHub repository will automatically trigger a new deployment:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Vercel automatically builds and deploys both projects

---

## Useful Commands

```bash
# View deployment logs
vercel logs [deployment-url]

# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Open project in dashboard
vercel --prod
```

---

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## Next Steps

- Set up custom domain
- Configure production analytics
- Set up error monitoring (e.g., Sentry)
- Enable Vercel Analytics
- Set up automated testing before deployment

---

Good luck with your deployment! 🚀

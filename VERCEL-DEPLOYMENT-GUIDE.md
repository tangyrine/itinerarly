# Vercel Deployment Guide

## Environment Variables Configuration

To fix the OAuth redirect issue in production, you need to set environment variables in Vercel.

### 1. In your Vercel Dashboard:

1. Go to your project: https://vercel.com/dashboard
2. Select your `itinerarly-fe` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
Variable Name: NEXT_PUBLIC_SITE_URL
Value: https://itinerarly-be.onrender.com
Environment: Production, Preview, Development
```

```
Variable Name: GA_ID
Value: G-84VJZDKNLV
Environment: Production, Preview, Development
```

### 2. Redeploy your application:

After adding the environment variables, trigger a new deployment:

```bash
# Method 1: Push to your git repository (if connected)
git add .
git commit -m "Fix OAuth redirect URLs for production"
git push

# Method 2: Redeploy manually in Vercel dashboard
# Go to Deployments → click three dots → Redeploy
```

### 3. Verify the fix:

1. Open your production URL: https://itinerarly-fe.vercel.app
2. Click the "Sign In" button
3. Click Google or GitHub OAuth
4. Verify it redirects to: https://itinerarly-be.onrender.com/oauth2/authorization/...

## Alternative Quick Fix

If you can't access Vercel dashboard immediately, the code has been updated with production-safe defaults:

- All fallback URLs now point to `https://itinerarly-be.onrender.com` instead of `localhost:8080`
- Console logs added to debug redirect URLs
- `.env.production` file created for production environment

## Files Updated:

1. `components/SignInModal.tsx` - OAuth redirect URLs
2. `lib/TokenProvider.tsx` - Token API endpoints  
3. `components/StateDetailsModal.tsx` - Backend API calls
4. `components/Navbar.tsx` - User authentication
5. `components/Planner.tsx` - Backend API calls
6. `.env.production` - Production environment variables

## Testing:

```bash
# Test locally with production build
npm run build
npm start

# Check console logs for redirect URLs
# Should show: https://itinerarly-be.onrender.com/oauth2/authorization/...
```

The OAuth buttons should now redirect to the correct backend URL in production! 🎉

# Production Environment Setup

## Critical Security Fix Applied

### Issue

The application was attempting to authenticate directly with SimplyBook.me from the frontend using API keys exposed via `VITE_` environment variables. This caused:

1. **Security vulnerability**: API keys exposed in frontend bundle
2. **Authentication errors**: Frontend can't safely authenticate with SimplyBook.me
3. **Production failures**: "SimplyBook.me authentication failed: Unexpected error"

### Solution

All SimplyBook.me API calls now go through the backend API:

```
Frontend → SDK → Backend API (/api/simplybook/*) → SimplyBook.me
```

## Environment Variables

### Backend API Server (api/)

Create `api/.env` with:

```bash
# SimplyBook.me credentials (BACKEND ONLY!)
SIMPLYBOOK_COMPANY=clairehamilton
SIMPLYBOOK_API_KEY=your_api_key_from_simplybook
SIMPLYBOOK_SECRET_KEY=your_secret_key_from_simplybook
SIMPLYBOOK_JSON_RPC_URL=https://user-api.simplybook.net/
SIMPLYBOOK_REST_API_URL=https://user-api-v2.simplybook.net/

# Other backend config
PORT=3001
NODE_ENV=production
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=bookings@clairehamilton.net
```

### Frontend (root)

Create `.env.production` with:

```bash
# API endpoint - points to your backend
VITE_API_BASE_URL=https://api.clairehamilton.net

# NO SimplyBook keys here! They stay in the backend only.
```

## Deployment Checklist

### Digital Ocean App Platform

1. **API Component** - Set environment variables:
   - `SIMPLYBOOK_COMPANY`
   - `SIMPLYBOOK_API_KEY`
   - `SIMPLYBOOK_SECRET_KEY`
   - `PORT=3001`
   - All email/database credentials

2. **Frontend Component** - Set environment variables:
   - `VITE_API_BASE_URL=https://api.clairehamilton.net`

3. **Verify CORS** - Ensure API allows requests from frontend domain:
   ```bash
   ALLOWED_ORIGINS=https://clairehamilton.net,https://www.clairehamilton.net
   ```

## Testing Production Build

```powershell
# Build frontend
npm run build

# Preview production build
npm run preview

# Test backend API
cd api
node server.js
```

## Troubleshooting

### "Authentication failed" errors

- Check backend has correct `SIMPLYBOOK_API_KEY` and `SIMPLYBOOK_SECRET_KEY`
- Verify keys are valid in SimplyBook.me dashboard
- Check API server logs for detailed error messages

### Frontend can't reach backend

- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS configuration in backend
- Verify API server is running and accessible

### 404 errors on API endpoints

- Ensure backend server is running on correct port
- Check API routes are registered properly
- Verify proxy configuration if using reverse proxy

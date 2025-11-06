# API Deployment Guide

## Current Status

### ✅ **Completed Locally**

All 19 API endpoints have been built and tested locally:

1. **Tenant API** (3 endpoints)
   - GET `/api/tenants/:subdomain` - Get tenant by subdomain
   - GET `/api/tenants/domain/:domain` - Get tenant by custom domain
   - GET `/api/tenants` - List all tenants

2. **Availability API** (3 endpoints)
   - GET `/api/availability/:tenantId` - Get availability calendar
   - GET `/api/availability/:tenantId/check` - Check specific date
   - GET `/api/locations/:tenantId` - Get locations

3. **Booking API** (4 endpoints)
   - POST `/api/bookings` - Create booking
   - GET `/api/bookings/:id` - Get booking details
   - PATCH `/api/bookings/:id/status` - Update booking status
   - GET `/api/bookings/tenant/:tenantId` - List tenant bookings

4. **Payment API** (5 endpoints)
   - POST `/api/payments` - Record payment
   - GET `/api/payments/:id` - Get payment details
   - GET `/api/payments/booking/:bookingId` - List payments for booking
   - POST `/api/payments/:id/refund` - Process refund
   - GET `/api/payments/tenant/:tenantId` - List tenant payments

5. **Analytics API** (4 endpoints)
   - POST `/api/analytics/sessions` - Create/update session
   - POST `/api/analytics/events` - Log event
   - GET `/api/analytics/:tenantId` - Get analytics metrics
   - GET `/api/analytics/sessions/:sessionId` - Get session timeline

### ❌ **Not Yet Deployed**

The API endpoints exist only in your local `api/` folder and are **NOT deployed to DigitalOcean**.

## Deployment Steps

### Option 1: Deploy as Separate Service (Recommended)

The `.do/app.yaml` file has been updated to include the API as a separate service. To deploy:

1. **Commit the changes:**

   ```powershell
   git add .
   git commit -m "Add API backend with all endpoints"
   git push origin main
   ```

2. **Update DigitalOcean App:**
   - Go to https://cloud.digitalocean.com/apps
   - Select your app (octopus-app)
   - Click "Settings" → "App Spec"
   - Replace the spec with the contents of `.do/app.yaml`
   - Click "Save" and redeploy

3. **Configure environment variables:**
   The following variables need to be set in DigitalOcean:
   - `DATABASE_URL` - Full PostgreSQL connection string
   - `DB_HOST` - Database host
   - `DB_PORT` - Database port (25060)
   - `DB_NAME` - Database name (defaultdb)
   - `DB_USER` - Database user (doadmin)
   - `DB_PASSWORD` - Database password
   - `DB_SSL` - Set to "require"

4. **Test the deployment:**

   ```powershell
   # Test health check
   Invoke-RestMethod -Uri "https://octopus-app-s8m2n.ondigitalocean.app/api/health" -Method GET

   # Test tenant endpoint
   Invoke-RestMethod -Uri "https://octopus-app-s8m2n.ondigitalocean.app/api/tenants/claire" -Method GET
   ```

### Option 2: Use the CLI

```powershell
cd c:\Users\julia\sw_website
doctl apps update YOUR_APP_ID --spec .do/app.yaml
```

## Configuration Details

### App Structure

```
octopus-app/
├── api/              # Backend API (NEW - needs deployment)
│   ├── server.js
│   ├── controllers/
│   ├── routes/
│   └── utils/
└── dist/             # Frontend static files (already deployed)
```

### Routes

- **Frontend:** `https://octopus-app-s8m2n.ondigitalocean.app/` (all non-API routes)
- **API:** `https://octopus-app-s8m2n.ondigitalocean.app/api/*` (all API routes)

### Database Connection

The API will connect to your existing PostgreSQL database:

- Host: `companion-platform-db-do-user-28631775-0.j.db.ondigitalocean.com`
- Port: `25060`
- Database: `defaultdb`
- SSL: Required

## Post-Deployment Verification

Once deployed, test each API group:

### 1. Tenant API

```powershell
# Get Claire's tenant
Invoke-RestMethod -Uri "https://octopus-app-s8m2n.ondigitalocean.app/api/tenants/claire"
```

### 2. Availability API

```powershell
# Get availability calendar
Invoke-RestMethod -Uri "https://octopus-app-s8m2n.ondigitalocean.app/api/availability/9daa3c12-bdec-4dc0-993d-7f9f8f391557?year=2025&month=11"
```

### 3. Booking API

```powershell
# Create a test booking
$body = @{
    tenantId = "9daa3c12-bdec-4dc0-993d-7f9f8f391557"
    clientName = "Test User"
    clientEmail = "test@example.com"
    # ... other fields
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://octopus-app-s8m2n.ondigitalocean.app/api/bookings" -Method POST -Body $body -ContentType "application/json"
```

## Important Notes

1. **Port Configuration:** The API server in `api/server.js` uses `process.env.PORT || 3001`, but DigitalOcean will set PORT to 8080. This is fine - the app will use whatever port DO provides.

2. **CORS Configuration:** Already configured to allow:
   - `*.prebooking.pro`
   - `*.companionconnect.app`
   - `clairehamilton.vip`

3. **Database Connection:** The `api/utils/db.js` file is already configured to read from environment variables.

4. **Two Services:** You'll have two separate services running:
   - **api** service (Node.js Express)
   - **frontend** service (Static site with http-server)

## Rollback Plan

If deployment fails:

1. Remove the `api` service from `.do/app.yaml`
2. Push the reverted changes
3. Redeploy

## Cost Impact

Adding the API service will:

- Add 1 more Basic XS instance ($5/month)
- Total: ~$10/month (frontend + API)

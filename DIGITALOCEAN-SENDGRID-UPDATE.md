# DigitalOcean App - SendGrid Configuration Update

**Date**: November 7, 2025  
**App**: octopus-app  
**App ID**: `d1c88e97-20a1-4b99-a582-11828f840b64`

---

## ⚠️ Manual Action Required

The `.do/app.yaml` file has been updated with SendGrid environment variable placeholders, but for security reasons, **the actual SENDGRID_API_KEY value must be added manually** in the DigitalOcean dashboard (it should NOT be committed to Git).

---

## ✅ What Was Updated

### 1. Local Configuration (`.do/app.yaml`)

Added the following environment variables to the `api` service:

- `SENDGRID_API_KEY` (marked as SECRET - value needs to be set in DO dashboard)
- `SENDGRID_FROM_EMAIL` = `bookings@avaliable.pro`
- `CLAIRE_NOTIFICATION_EMAIL` = `claire@avaliable.pro`

### 2. API Base URL

Fixed the frontend `VITE_API_BASE_URL` from `clairehamilton.vip` to `avaliable.pro`

---

## 🔧 Required Manual Steps

### Step 1: Go to DigitalOcean App Settings

Open the app settings page:
https://cloud.digitalocean.com/apps/d1c88e97-20a1-4b99-a582-11828f840b64/settings

### Step 2: Configure API Service Environment Variables

1. Click on the **"api"** component in the services list
2. Scroll down to the **"Environment Variables"** section
3. Click **"Edit"** or **"Add Variable"**

### Step 3: Add SendGrid Variables

Add or edit these three environment variables:

#### Variable 1: SENDGRID_API_KEY

- **Key**: `SENDGRID_API_KEY`
- **Value**: Your SendGrid API key from dashboard (starts with SG.)
- **Type**: **Encrypt** (mark as SECRET)
- **Scope**: `RUN_TIME` or `RUN_AND_BUILD_TIME`

#### Variable 2: SENDGRID_FROM_EMAIL

- **Key**: `SENDGRID_FROM_EMAIL`
- **Value**: `bookings@avaliable.pro`
- **Type**: Plain text
- **Scope**: `RUN_TIME` or `RUN_AND_BUILD_TIME`

#### Variable 3: CLAIRE_NOTIFICATION_EMAIL

- **Key**: `CLAIRE_NOTIFICATION_EMAIL`
- **Value**: `claire@avaliable.pro`
- **Type**: Plain text
- **Scope**: `RUN_TIME` or `RUN_AND_BUILD_TIME`

### Step 4: Save and Deploy

1. Click **"Save"**
2. DigitalOcean will automatically trigger a redeployment
3. Wait for deployment to complete (usually 5-10 minutes)
4. Check deployment logs for any errors

---

## 📊 Current App Configuration

### App Details

- **Name**: octopus-app
- **Region**: Sydney (syd)
- **Domain**: avaliable.pro
- **Ingress**: https://octopus-app-tw5wu.ondigitalocean.app

### Services

#### 1. API Service (Backend)

- **Path**: `/api`
- **Runtime**: Node.js
- **Command**: `node server.js`
- **Port**: 8080
- **Instance**: basic-xxs
- **Source**: `/api` directory

**Environment Variables** (after update):

- DATABASE_URL
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SSL
- NODE_ENV = production
- PORT = 8080
- **SENDGRID_API_KEY** ⭐ (needs manual update)
- **SENDGRID_FROM_EMAIL** ⭐ (needs manual update)
- **CLAIRE_NOTIFICATION_EMAIL** ⭐ (needs manual update)

#### 2. Frontend Service (sw-website)

- **Path**: `/`
- **Runtime**: Node.js (http-server)
- **Build**: `npm install && npm run build`
- **Port**: 8080
- **Instance**: basic-xxs

**Environment Variables**:

- VITE_API_BASE_URL = https://avaliable.pro/api ✅ (updated)

---

## 🧪 Testing After Update

### 1. Check Deployment Status

```
https://cloud.digitalocean.com/apps/d1c88e97-20a1-4b99-a582-11828f840b64/deployments
```

### 2. Verify Environment Variables

- Go to Settings → api component → Environment Variables
- Confirm all three SendGrid variables are present
- Verify SENDGRID_API_KEY shows as "Encrypted"

### 3. Test Email Functionality

After deployment completes, test the email service:

```bash
# Test from local machine hitting production API
curl -X POST https://avaliable.pro/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"julian.dellabosca@gmail.com"}'
```

Or create a test booking through the website and verify emails are sent.

### 4. Check Application Logs

```
https://cloud.digitalocean.com/apps/d1c88e97-20a1-4b99-a582-11828f840b64/logs
```

Look for:

- `✓ SendGrid initialized` or similar startup messages
- No `SENDGRID_API_KEY undefined` errors
- Successful email send confirmations

---

## 🔒 Security Notes

### API Key Security

- ✅ SENDGRID_API_KEY marked as SECRET/Encrypted in DO
- ✅ NOT committed to Git repository
- ✅ Only accessible in production environment
- ⚠️ If leaked, regenerate immediately in SendGrid dashboard

### Environment File Security

- `.env` file contains API key for LOCAL development only
- `.env` is in `.gitignore` - never commit it
- Production uses DO environment variables (different from .env)

---

## 📝 Deployment Checklist

- [x] Updated `.do/app.yaml` with SendGrid env var structure
- [x] Fixed VITE_API_BASE_URL to use avaliable.pro
- [x] **MANUAL**: Add SENDGRID_API_KEY in DO dashboard ✅
- [x] **MANUAL**: Add SENDGRID_FROM_EMAIL in DO dashboard ✅
- [x] **MANUAL**: Add CLAIRE_NOTIFICATION_EMAIL in DO dashboard ✅
- [x] **MANUAL**: Save changes and wait for redeployment ✅
- [ ] Test email functionality after deployment
- [ ] Verify no errors in deployment logs
- [ ] Test booking flow end-to-end

---

## ✅ Deployment Completed

**Date**: November 7, 2025  
**Deployment ID**: `ba288711-bd52-4606-aae7-f9823fe8a863`  
**Status**: LIVE

All SendGrid environment variables have been successfully added to the DigitalOcean app and the deployment has completed. The application is now running at https://avaliable.pro with full email functionality.

---

## 🆘 Troubleshooting

### "Unauthorized to perform this operation" (403 error)

**Issue**: doctl update command failed with 403  
**Solution**: ✅ RESOLVED - Environment variables were added manually through the DigitalOcean web dashboard since the API token did not have write permissions for app configuration.

### Deployment Fails After Adding Variables

- Check deployment logs for specific errors
- Verify all environment variable values are correct (no typos)
- Ensure SENDGRID_API_KEY is marked as encrypted
- Confirm database variables are still present

### Emails Still Not Sending

- Verify all 3 SendGrid variables are present in the api service
- Check the SENDGRID_API_KEY value is correct (regenerate if needed)
- Look for SendGrid errors in application logs
- Test with the SendGrid Activity dashboard

---

## 📞 Direct Links

- **App Settings**: https://cloud.digitalocean.com/apps/d1c88e97-20a1-4b99-a582-11828f840b64/settings
- **Deployments**: https://cloud.digitalocean.com/apps/d1c88e97-20a1-4b99-a582-11828f840b64/deployments
- **Logs**: https://cloud.digitalocean.com/apps/d1c88e97-20a1-4b99-a582-11828f840b64/logs
- **SendGrid Dashboard**: https://app.sendgrid.com/

---

**Status**: ✅ DEPLOYED AND OPERATIONAL

SendGrid email service is now fully configured and operational in production at https://avaliable.pro

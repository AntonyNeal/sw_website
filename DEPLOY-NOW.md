# Deploy to clairehamilton.com.au - Quick Guide

## ✅ Configuration Complete

Your app spec has been updated for **clairehamilton.com.au**

## 🚀 Deployment Steps (via Web Console)

### Step 1: Update App Configuration

1. Go to: https://cloud.digitalocean.com/apps/d1c88e97-20a1-4b99-a582-11828f840b64/settings
2. Scroll to **App Spec** section
3. Click **Edit**
4. Copy the entire contents of `app-spec.yaml` from this project
5. Paste into the editor
6. Click **Save**
7. Review changes and click **Update App**

### Step 2: Add Custom Domain

1. Go to **Settings** → **Domains** tab
2. Click **Add Domain**
3. Enter: `clairehamilton.com.au`
4. Click **Add Domain**

DigitalOcean will show you the DNS records to add.

### Step 3: Configure DNS

Go to your domain registrar and add these CNAME records:

**Root domain:**

```
Type: CNAME
Name: @
Value: octopus-app-tw5wu.ondigitalocean.app
TTL: 3600
```

**WWW subdomain:**

```
Type: CNAME
Name: www
Value: octopus-app-tw5wu.ondigitalocean.app
TTL: 3600
```

**Note:** Some registrars don't allow CNAME for root domains. If yours doesn't:

- Use A records pointing to the IP addresses DigitalOcean provides
- Or use an ALIAS record if your registrar supports it

### Step 4: Update Environment Variables (CRITICAL!)

In **Settings** → **Environment Variables**, update these:

**Required:**

- `DATABASE_URL` - Your PostgreSQL connection string
- `SENDGRID_API_KEY` - Your SendGrid API key
- `JWT_SECRET` - Generate: `openssl rand -base64 32`
- `ALLOWED_ORIGIN` - Set to: `https://clairehamilton.com.au`

**Optional:**

- `VITE_GA_MEASUREMENT_ID` - Your Google Analytics ID
- `STRIPE_PUBLIC_KEY` / `STRIPE_SECRET_KEY` - If using payments

### Step 5: Verify Deployment

Wait 5-10 minutes after DNS changes, then test:

```powershell
# Check DNS
nslookup clairehamilton.com.au

# Test HTTPS
curl -I https://clairehamilton.com.au

# Test API
curl https://clairehamilton.com.au/api/health
```

## 📋 Configuration Summary

### What's Been Updated:

- ✅ App name: `octopus-app`
- ✅ Region: `syd1` (Sydney - best for Australian users)
- ✅ Domain: `clairehamilton.com.au`
- ✅ API URL: `https://clairehamilton.com.au/api`
- ✅ CORS: Configured for `*.clairehamilton.com.au`
- ✅ GitHub repo: `AntonyNeal/sw_website`
- ✅ Email: `bookings@clairehamilton.com.au`

### Current App:

- **App ID:** `d1c88e97-20a1-4b99-a582-11828f840b64`
- **Current URL:** https://octopus-app-tw5wu.ondigitalocean.app
- **New URL:** https://clairehamilton.com.au (after DNS setup)

## 🔧 Alternative: PowerShell Deployment

If you get elevated API permissions, you can deploy via CLI:

```powershell
.\doctl.exe apps update d1c88e97-20a1-4b99-a582-11828f840b64 --spec app-spec.yaml
```

Currently, your token has read-only permissions. To enable write access:

1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Create new token with **Write** scope
3. Run: `.\doctl.exe auth init` and paste the new token

## 📖 Full Documentation

See **CLAIREHAMILTON-DOMAIN-SETUP.md** for complete details including:

- Email configuration with SendGrid
- DNS registrar-specific instructions
- Troubleshooting guide
- Security best practices

## ⚠️ Important Notes

1. **DNS Propagation** takes 24-48 hours globally (usually faster)
2. **SSL Certificate** is automatically issued by DigitalOcean (Let's Encrypt)
3. **Backup** your current app configuration before updating
4. **Test** on the DigitalOcean URL before switching DNS

## 🆘 If Something Goes Wrong

Rollback to previous deployment:

1. Go to **Deployments** tab
2. Find the last working deployment
3. Click **...** → **Redeploy**

---

**Ready to deploy?** Start with Step 1 above! 🚀

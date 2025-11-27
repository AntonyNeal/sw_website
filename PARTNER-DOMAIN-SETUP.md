# Domain Setup Guide: partner-domain.com

Complete guide to configure **partner-domain.com** for your booking platform.

This guide covers:

- DNS configuration with domain registrar
- SSL certificate setup (automatic)
- Email subdomain configuration
- Platform-specific deployment steps

---

## Option 1: DigitalOcean App Platform (Recommended)

### Prerequisites

- DigitalOcean account
- Domain registered at your registrar (e.g., GoDaddy, Namecheap)
- GitHub repository connected

### Step 1: Deploy Your Application

```powershell
# Deploy using the configured app-spec.yaml
.\\doctl.exe apps create --spec app-spec.yaml

# Or update existing app
.\\doctl.exe apps update YOUR_APP_ID --spec app-spec.yaml
```

### Step 2: Configure DNS Records

Log in to your domain registrar and add DNS records:

**For Root Domain (partner-domain.com):**

| Type  | Name | Value/Target                  | TTL  |
| ----- | ---- | ----------------------------- | ---- |
| A     | @    | `your-app.ondigitalocean.app` | 3600 |
| CNAME | www  | `partner-domain.com`          | 3600 |

**For Email (if using SendGrid):**

Add your provider-specific email DNS entries for domain authentication.

### Step 3: Add Domain to DigitalOcean App

1. Go to DigitalOcean Console
2. Navigate to your App
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `partner-domain.com`
6. Click **Add Domain**

DigitalOcean will automatically:

- Verify DNS configuration
- Issue SSL certificate (Let's Encrypt)
- Configure HTTPS redirect

### Step 4: Verify SSL Certificate

Wait 5-10 minutes for DNS propagation, then check:

```powershell
# Test HTTPS connection
curl -I https://partner-domain.com
```

You should see `HTTP/2 200` and SSL certificate details.

---

## Option 2: Vercel

### Prerequisites

- Vercel account
- GitHub repository connected
- Domain access

### Step 1: Deploy to Vercel

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Step 2: Add Domain in Vercel Dashboard

1. Go to **Project Settings** → **Domains**
2. Click **Add**
3. Enter: `partner-domain.com`
4. Click **Add**

Vercel will provide DNS records to add.

### Step 3: Configure DNS

Add records at your registrar as provided by Vercel dashboard.

### Step 4: Update Environment Variables

In Vercel dashboard, add these environment variables:

- `VITE_API_BASE_URL` = `https://partner-domain.com/api`
- `DATABASE_URL` = Your database connection string
- `SENDGRID_API_KEY` = Your SendGrid API key

---

## Email Configuration

Include domain authentication steps for your chosen email provider (SendGrid or similar).

---

## Testing Checklist

### DNS Verification

```powershell
# Check DNS propagation
nslookup partner-domain.com

# Check HTTPS
curl -I https://partner-domain.com

# Check API endpoint
curl https://partner-domain.com/api/health
```

### Application Testing

- [ ] Home page loads correctly
- [ ] API endpoints respond
- [ ] Booking form works
- [ ] Email notifications send successfully
- [ ] Images load from correct domain
- [ ] No CORS errors in browser console

---

## Next Steps

1. ✅ Deploy application to chosen platform
2. ✅ Configure DNS records at registrar
3. ✅ Add domain in platform dashboard
4. ✅ Verify SSL certificate
5. ✅ Configure email authentication
6. ✅ Test all functionality
7. ✅ Set up monitoring and analytics

**Your application should now be live at https://partner-domain.com!**

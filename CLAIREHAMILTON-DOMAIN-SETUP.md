# Domain Setup Guide: clairehamilton.com.au

Complete guide to configure **clairehamilton.com.au** for your service booking platform.

## Overview

This guide covers:

- DNS configuration with your domain registrar
- SSL certificate setup (automatic)
- Email subdomain configuration
- Platform-specific deployment steps

---

## Option 1: DigitalOcean App Platform (Recommended)

### Prerequisites

- DigitalOcean account
- Domain registered at your registrar (e.g., GoDaddy, Namecheap, Crazy Domains)
- GitHub repository connected

### Step 1: Deploy Your Application

```powershell
# Deploy using the configured app-spec.yaml
doctl apps create --spec app-spec.yaml

# Or update existing app
doctl apps update YOUR_APP_ID --spec app-spec.yaml
```

### Step 2: Configure DNS Records

Log in to your domain registrar and add these DNS records:

**For Root Domain (clairehamilton.com.au):**

| Type  | Name | Value/Target                  | TTL  |
| ----- | ---- | ----------------------------- | ---- |
| A     | @    | `your-app.ondigitalocean.app` | 3600 |
| CNAME | www  | `clairehamilton.com.au`       | 3600 |

**For Email (if using SendGrid):**

| Type  | Name           | Value                                      | TTL  |
| ----- | -------------- | ------------------------------------------ | ---- |
| CNAME | em1234         | `u1234567.wl001.sendgrid.net`              | 3600 |
| CNAME | s1.\_domainkey | `s1.domainkey.u1234567.wl001.sendgrid.net` | 3600 |
| CNAME | s2.\_domainkey | `s2.domainkey.u1234567.wl001.sendgrid.net` | 3600 |

**Note:** Replace the SendGrid values with your actual values from your SendGrid account settings.

### Step 3: Add Domain to DigitalOcean App

1. Go to DigitalOcean Console
2. Navigate to your App
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `clairehamilton.com.au`
6. Click **Add Domain**

DigitalOcean will automatically:

- Verify DNS configuration
- Issue SSL certificate (Let's Encrypt)
- Configure HTTPS redirect

### Step 4: Verify SSL Certificate

Wait 5-10 minutes for DNS propagation, then check:

```powershell
# Test HTTPS connection
curl -I https://clairehamilton.com.au
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
3. Enter: `clairehamilton.com.au`
4. Click **Add**

Vercel will provide DNS records to add.

### Step 3: Configure DNS

Add these records at your registrar:

| Type  | Name | Value                  | TTL  |
| ----- | ---- | ---------------------- | ---- |
| A     | @    | `76.76.21.21`          | 3600 |
| CNAME | www  | `cname.vercel-dns.com` | 3600 |

**Note:** Use the exact values provided by Vercel dashboard.

### Step 4: Update Environment Variables

In Vercel dashboard, add these environment variables:

- `VITE_API_BASE_URL` = `https://clairehamilton.com.au/api`
- `DATABASE_URL` = Your database connection string
- `SENDGRID_API_KEY` = Your SendGrid API key

---

## Email Configuration (SendGrid)

### Step 1: Domain Authentication

1. Log in to [SendGrid](https://app.sendgrid.com/)
2. Go to **Settings** → **Sender Authentication**
3. Click **Authenticate Your Domain**
4. Enter: `clairehamilton.com.au`
5. Copy the provided DNS records

### Step 2: Add DNS Records

Add the CNAME records provided by SendGrid to your domain registrar.

### Step 3: Verify Domain

After DNS propagation (24-48 hours), click **Verify** in SendGrid dashboard.

### Step 4: Update Email Configuration

Update these environment variables:

```bash
SENDGRID_FROM_EMAIL=bookings@clairehamilton.com.au
BUSINESS_NOTIFICATION_EMAIL=notifications@clairehamilton.com.au
```

---

## Testing Checklist

### DNS Verification

```powershell
# Check DNS propagation
nslookup clairehamilton.com.au

# Check HTTPS
curl -I https://clairehamilton.com.au

# Check API endpoint
curl https://clairehamilton.com.au/api/health
```

### Application Testing

- [ ] Home page loads correctly
- [ ] API endpoints respond
- [ ] Booking form works
- [ ] Email notifications send successfully
- [ ] Images load from correct domain
- [ ] No CORS errors in browser console

### SSL/Security

- [ ] HTTPS redirects work
- [ ] SSL certificate is valid
- [ ] No mixed content warnings
- [ ] Security headers present

---

## Common Issues & Solutions

### Issue: "Domain not verified"

**Solution:**

- Wait 24-48 hours for DNS propagation
- Use `nslookup` to verify DNS records
- Check for typos in DNS configuration

### Issue: "SSL certificate not issued"

**Solution:**

- Verify DNS records point to correct target
- Wait for automatic SSL provisioning (5-10 minutes)
- Check platform status page

### Issue: "CORS errors"

**Solution:**

- Verify `ALLOWED_ORIGIN` environment variable
- Check API server CORS configuration in `api/server.js`
- Clear browser cache and test again

### Issue: "Emails not sending"

**Solution:**

- Complete SendGrid domain authentication
- Verify DNS records for email
- Check SendGrid API key is correct
- Test with SendGrid API directly

---

## DNS Registrar-Specific Instructions

### GoDaddy

1. Log in to GoDaddy account
2. Go to **My Products** → **DNS**
3. Select your domain
4. Click **Add** for each DNS record
5. Save changes

### Namecheap

1. Log in to Namecheap account
2. Go to **Domain List** → Select domain
3. Click **Advanced DNS**
4. Click **Add New Record**
5. Enter record details and save

### Crazy Domains (Australian)

1. Log in to Crazy Domains account
2. Go to **My Account** → **Domains**
3. Select **Manage**
4. Go to **DNS Settings**
5. Add records and save

---

## Monitoring & Maintenance

### Regular Checks

- Monitor uptime at https://clairehamilton.com.au
- Check SSL certificate expiration (auto-renewed)
- Review application logs for errors
- Monitor email delivery rates

### Analytics

Update Google Analytics in `.env.production`:

```bash
VITE_GA_MEASUREMENT_ID=G-YOUR-ACTUAL-ID
```

---

## Support Resources

### DigitalOcean

- [App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)
- [Custom Domains Guide](https://docs.digitalocean.com/products/app-platform/how-to/manage-domains/)
- [Support Tickets](https://cloud.digitalocean.com/support)

### Vercel

- [Custom Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Support](https://vercel.com/support)

### SendGrid

- [Domain Authentication](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication)
- [Support](https://support.sendgrid.com/)

---

## Next Steps

1. ✅ Deploy application to chosen platform
2. ✅ Configure DNS records at registrar
3. ✅ Add domain in platform dashboard
4. ✅ Verify SSL certificate
5. ✅ Configure email authentication
6. ✅ Test all functionality
7. ✅ Set up monitoring and analytics

**Your application should now be live at https://clairehamilton.com.au!**

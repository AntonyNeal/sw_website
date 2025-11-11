# Setup clairehamilton.com.au Domain

## Current Status

- ✅ Domain registered: `clairehamilton.com.au` (Crazy Domains)
- ✅ Domain expires: November 8, 2027
- ✅ App deployed: `octopus-app-tw5wu.ondigitalocean.app`
- ✅ App spec configured for custom domain

## Step 1: Configure DNS at Crazy Domains

### Option A: Use DigitalOcean Nameservers (Recommended)

1. **Go to Crazy Domains**
   - Log in to https://crazydomain.com.au
   - Go to Domain Management → `clairehamilton.com.au`
   - Click "Name Servers" tab

2. **Update Nameservers to DigitalOcean**

   ```
   ns1.digitalocean.com
   ns2.digitalocean.com
   ns3.digitalocean.com
   ```

3. **Wait for DNS Propagation** (can take 24-48 hours)

### Option B: Use CNAME Records (Faster)

1. **Go to Crazy Domains DNS Settings**
   - Log in to https://crazydomain.com.au
   - Go to Domain Management → `clairehamilton.com.au`
   - Click "DNS Settings" or "Advanced DNS"

2. **Add/Update DNS Records**

   **For root domain (clairehamilton.com.au):**

   ```
   Type: A
   Name: @ (or leave blank)
   Value: (Get this from DigitalOcean - see Step 2)
   TTL: 3600
   ```

   **For www subdomain:**

   ```
   Type: CNAME
   Name: www
   Value: octopus-app-tw5wu.ondigitalocean.app
   TTL: 3600
   ```

   **Delete any existing:**
   - Old A records
   - Old CNAME records
   - Parking page records

## Step 2: Add Domain in DigitalOcean App Platform

1. **Open DigitalOcean Console**
   - Go to https://cloud.digitalocean.com/apps
   - Select your app: `octopus-app-tw5wu`

2. **Go to Settings → Domains**

3. **Add Custom Domain**
   - Click "Add Domain"
   - Enter: `clairehamilton.com.au`
   - Check "Use as primary domain"
   - Check "Redirect www to root" (or vice versa)

4. **Follow DigitalOcean's DNS Instructions**
   - They will show you the exact A record IP address
   - They will verify domain ownership
   - They will issue SSL certificate automatically

## Step 3: Update App Configuration (If Needed)

The app is already configured for `clairehamilton.com.au` in:

- ✅ `app-spec.yaml` - domain configured
- ✅ Email settings ready (bookings@clairehamilton.com.au)
- ✅ CORS/API settings configured

**No code changes needed!**

## Step 4: Test the Domain

After DNS propagates (15 minutes to 48 hours):

1. **Test DNS Resolution**

   ```powershell
   nslookup clairehamilton.com.au
   ```

2. **Test Website Access**
   - https://clairehamilton.com.au
   - https://www.clairehamilton.com.au

3. **Verify SSL Certificate**
   - Check for padlock icon in browser
   - Certificate should be issued automatically by DigitalOcean

4. **Test Redirects**
   - Ensure www redirects to root (or vice versa)
   - Ensure http redirects to https

## Quick Reference: Current URLs

| Type                 | URL                                          | Status          |
| -------------------- | -------------------------------------------- | --------------- |
| DigitalOcean Default | https://octopus-app-tw5wu.ondigitalocean.app | ✅ Active       |
| Custom Domain (Goal) | https://clairehamilton.com.au                | 🎯 To Configure |
| WWW Subdomain        | https://www.clairehamilton.com.au            | 🎯 To Configure |

## Recommended Next Steps

1. ✅ **Configure DNS** (use Option B - CNAME for faster setup)
2. ⏳ **Add domain in DigitalOcean** (following their wizard)
3. ⏳ **Wait for SSL certificate** (automatic, takes 5-10 minutes)
4. ✅ **Test the site**
5. ✅ **Update any external links** to use new domain

## Troubleshooting

### Domain Not Working After 24 Hours

- Check DNS propagation: https://www.whatsmydns.net/#A/clairehamilton.com.au
- Verify nameservers are correct
- Check DigitalOcean domain verification status

### SSL Certificate Issues

- Wait 10-15 minutes after adding domain
- Check DigitalOcean dashboard for certificate status
- Ensure DNS is pointing correctly

### "Site Can't Be Reached" Error

- DNS hasn't propagated yet (wait longer)
- Check A record points to correct IP
- Verify domain is added in DigitalOcean

## Domain Health Checklist

Before going live, ensure:

- [ ] DNS records configured at Crazy Domains
- [ ] Domain added in DigitalOcean App Platform
- [ ] SSL certificate issued (green padlock)
- [ ] WWW redirects to root domain
- [ ] HTTP redirects to HTTPS
- [ ] Email addresses work (if using domain email)
- [ ] All pages load correctly
- [ ] Booking system functional
- [ ] Mobile responsive

## Domain Security Recommendations

From your Crazy Domains screenshot, consider:

1. **Domain Guard** (Currently activated ✅)
   - Keeps personal information private
   - Prevents identity theft and spam
   - **Status:** Good - keep activated

2. **Premium DNS** (⚠️ Using standard DNS)
   - Faster network speeds
   - DDoS protection
   - **Optional:** Upgrade if you experience high traffic

3. **Domain Expiry Protection** (⚠️ Not activated)
   - Maintains ownership after expiration
   - **Recommended:** Activate to prevent accidental loss
   - Cost: ~$14.99/year

## Support

- **Crazy Domains Support:** https://www.crazydomains.com.au/help/
- **DigitalOcean Docs:** https://docs.digitalocean.com/products/app-platform/how-to/manage-domains/
- **DNS Propagation Checker:** https://www.whatsmydns.net/

---

**Status:** Ready to configure DNS and add domain to DigitalOcean
**Last Updated:** 2025-11-11

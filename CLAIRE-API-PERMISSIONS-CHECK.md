# 🔐 Claire's API Setup - Permission Check Needed

## ✅ What's Working

Good news! Your API credentials are working:

- ✅ Authentication successful
- ✅ Token generation works
- ✅ API keys are saved correctly

## ⚠️ Permission Issue

The API is returning "Access denied" when trying to fetch your services. This means the API key needs additional permissions enabled.

## 📋 What Claire Needs to Do

### Step 1: Enable API Permissions

1. Go to **SimplyBook.me** → Log in to your admin panel
2. Navigate to **Settings** → **Integrations** → **API**
3. Look for a section called **"API Permissions"** or **"Allowed Methods"**
4. Make sure these permissions are **ENABLED**:
   - ☐ **getEventList** (to fetch your services)
   - ☐ **getCompanyInfo** (to get business details)
   - ☐ **book** (to create bookings)
   - ☐ **getBookingDetails** (to retrieve booking info)
   - ☐ **cancelBooking** (to cancel bookings)
   - ☐ **getStartTimeMatrix** (to check availability)

### Step 2: Check API Type

Look at the top of the API page - it should say:

- **JSON-RPC API** ✅ (This is what we need!)
- NOT "Admin API" or "Partner API"

### Step 3: Verify Webhook Settings

The webhook URL should be set to:

```
https://api.clairehamilton.net/api/v1/webhooks/simplybook
```

Make sure these webhook triggers are enabled:

- ☐ **Trigger on create** (when booking is created)
- ☐ **Trigger on change** (when booking is modified)
- ☐ **Trigger on cancel** (when booking is cancelled)
- ☐ **Trigger on remind** (optional - for reminders)

### Step 4: Save Everything

1. After making changes, click **Save**
2. Take a screenshot of the full API page (scrolling to show all settings)
3. Send that to Julian

## 🆘 If You Can't Find These Settings

If you don't see permission settings on the API page, it might be:

1. **Hidden behind a dropdown or tab** - look for "Advanced Settings" or "Permissions"
2. **Requires a plan upgrade** - Basic plans might not have full API access
3. **Needs to be enabled by SimplyBook support** - you might need to contact them

## 📞 Contact SimplyBook Support (if needed)

**Email:** support@simplybook.me  
**What to say:**

> Hi, I'm trying to set up API integration for my booking system at clairehamilton.simplybook.me.
>
> I've generated API keys but I'm getting "Access denied" when calling the getEventList method.
>
> Can you please enable full API permissions for my account? I need access to:
>
> - getEventList
> - getCompanyInfo
> - book
> - getBookingDetails
> - cancelBooking
> - getStartTimeMatrix
>
> My company login is: clairehamilton
>
> Thank you!

## 🎯 Expected Outcome

Once permissions are enabled, the test should show:

```
✅ Authentication successful!
✅ Found 5 service(s)!

📋 Available Services:
  • 1 Hour Companion - $300
  • 2 Hour Companion - $550
  • Dinner Date - $800
  ... etc

🎉 Claire's SimplyBook.me API is working correctly!
```

---

**Status:** Waiting for Claire to enable API permissions  
**Next Test:** After Claire enables permissions, run: `node test-claire-api.js`  
**Updated:** November 12, 2025 6:30 PM

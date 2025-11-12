# 👩‍🍳 Recipe: Connecting Your Booking System

**By: Julian (Your Developer)**  
**For: Claire Hamilton (Platform Owner)**  
**Prep Time:** 15 minutes  
**Cook Time:** 0 minutes (no coding!)  
**Difficulty:** Easy 🟢  
**Servings:** 1 fully operational booking system

---

## 🥘 What You're Making Today

A fully connected booking system that lets clients book appointments online while you manage everything from one dashboard. Think of this like connecting your coffee machine to the water supply - all the machinery is built, we just need to plug it in!

---

## 🛒 Ingredients You'll Need

- [ ] **1 SimplyBook.me account** (already set up ✅)
- [ ] **Access to your SimplyBook.me dashboard** (you have this ✅)
- [ ] **2 fresh API keys** (we'll make these together)
- [ ] **1 webhook URL** (already prepared for you: `https://api.clairehamilton.net/api/v1/webhooks/simplybook`)
- [ ] **5-10 minutes of your time** ⏱️
- [ ] **1 secure message to send to Julian** (email or WhatsApp)

---

## 👩‍🍳 Kitchen Tools Required

- Computer with internet connection
- Access to SimplyBook.me dashboard
- Your WhatsApp or email (to send info to Julian)

---

## 📝 Recipe Instructions

### STEP 1: Preheat Your Dashboard (2 minutes)

1. Open your browser and go to **https://simplybook.me**
2. Log in with your credentials
3. You should see your booking dashboard
4. Take a deep breath - this is going to be easy! ☕

> **Chef's Tip:** Keep this window open - you'll need it for the whole recipe!

---

### STEP 2: Navigate to the Secret Ingredient Vault (1 minute)

1. Look for the **Settings** menu (usually a gear icon ⚙️ or in the sidebar)
2. Click **Settings**
3. Find and click **For Development** (might be under "Advanced" or similar)
4. Click **API** (this is where the magic happens!)

> **Chef's Note:** If you don't see "API" in the menu, you might need to enable it first:
>
> - Go to **Settings** → **Plugins**
> - Find **API** in the list
> - Enable it
> - Then go back to **Settings** → **For Development** → **API**

---

### STEP 3: Generate Fresh API Keys (3 minutes)

Think of API keys like giving someone a key to your house. We're making fresh keys so only authorized people can access your booking system.

1. Look for a button that says **"Generate new keys"** or **"Regenerate API keys"**
2. Click it
3. Two long text strings will appear:
   - **API Key** (sometimes called "Public Key")
   - **Secret API Key** (sometimes called "Private Key" or "Secret Key")
4. Keep this page open - you'll need to copy these in a moment!

> **⚠️ Important:** These keys are like your house keys - don't post them on social media or public forums! Only send them to Julian directly.

---

### STEP 4: Add the Communication Channel (3 minutes)

This is like giving your phone number to a delivery service - it lets SimplyBook.me notify our system instantly when someone makes a booking.

1. On the same API page, scroll down to find **"Callback URL"** or **"Webhook URL"**
2. In that field, carefully type (or copy/paste) this EXACT address:
   ```
   https://api.clairehamilton.net/api/v1/webhooks/simplybook
   ```
3. **Double-check for typos!** One wrong character and it won't work.
4. Look for **"Number of API retries"** - set it to **3**
5. Make sure these checkboxes are ticked:
   - ✅ Trigger on create (new bookings)
   - ✅ Trigger on change (booking changes)
   - ✅ Trigger on cancel (cancellations)
   - ✅ Trigger on remind (reminders)
6. Click **"Save"**

> **Chef's Tip:** Take a screenshot of this page after you save it - it'll be helpful if we need to check anything later!

---

### STEP 5: Verify Your Business Information (2 minutes)

Quick quality check - let's make sure your contact details are correct!

1. Go to **Settings** → **Business Info**
2. Check that these are correct:
   - Your business name
   - Your email address
   - Your phone number
   - Your business address
3. Update anything that's wrong
4. Click **Save** if you made changes

> **Why this matters:** Clients will see this info in their booking confirmations!

---

### STEP 6: Check Your Services (1 minute)

Quick peek to make sure you have at least one service clients can book.

1. Go to **Settings** → **Services** (or just **Services** in the main menu)
2. Do you see at least one service listed?
   - ✅ **YES** → Great! Move to Step 7
   - ❌ **NO** → Add one quickly:
     - Click **"Add Service"**
     - Give it a name (e.g., "Consultation", "Session")
     - Set the duration (in minutes)
     - Set the price
     - Click **Save**

---

### STEP 7: Plate and Serve (Send to Julian) (3 minutes)

Time to deliver the final ingredients to your developer so he can complete the connection!

**Copy this message template and fill it in:**

```
Hi Julian,

✅ SimplyBook.me API Setup Complete!

🔑 API KEYS (treat these as confidential):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API Key: [PASTE YOUR API KEY HERE]

Secret API Key: [PASTE YOUR SECRET KEY HERE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Webhook URL Configured:
https://api.clairehamilton.net/api/v1/webhooks/simplybook
(Screenshot attached - see attachment)

✅ Business Info: Verified
✅ Services: At least 1 service ready

Ready for testing!
- Claire
```

**How to fill it in:**

1. Go back to your SimplyBook.me API page
2. Copy the **API Key** (the first long code)
3. Paste it where it says `[PASTE YOUR API KEY HERE]`
4. Copy the **Secret API Key** (the second long code)
5. Paste it where it says `[PASTE YOUR SECRET KEY HERE]`
6. Attach your screenshot of the webhook configuration
7. Send via **WhatsApp** or **secure email** to Julian

> **🔒 Security Note:** Send this via WhatsApp direct message or email - NOT in a group chat or public channel!

---

## 🎉 What Happens Next?

### Immediately (Within 10 minutes):

Julian will update the server configuration with your new keys. This takes about 2 minutes.

### Short Term (Same day):

Julian will run tests to verify everything is connected and working. This takes about 5-10 minutes.

### Live Status (When ready):

Your booking system will be **100% OPERATIONAL**:

- ✅ Clients can book online 24/7
- ✅ Automatic email confirmations sent
- ✅ You manage everything from SimplyBook.me dashboard
- ✅ Real-time notifications when bookings happen

---

## 🆘 Troubleshooting

### "I don't see the API option in Settings"

**Solution:** You need to enable it first:

1. Go to **Settings** → **Plugins**
2. Find **"API"** and enable it
3. Then go to **Settings** → **For Development** → **API**

### "I accidentally shared my API keys publicly"

**Solution:** No panic! Just regenerate new ones:

1. Go back to **Settings** → **For Development** → **API**
2. Click **"Generate new keys"** again
3. Old keys stop working immediately
4. Send the new keys to Julian

### "I made a typo in the webhook URL"

**Solution:** Just edit it:

1. Go back to **Settings** → **For Development** → **API**
2. Fix the webhook URL
3. Click **Save**
4. Let Julian know you fixed it

### "The webhook URL field is too short"

**Solution:** Most fields expand as you type, but if not:

- Try clicking elsewhere then back to the field
- Or paste it in parts
- Take a screenshot and send to Julian - he can help

---

## ✅ Final Checklist

Before you send the message to Julian, check you've done ALL of these:

- [ ] Generated fresh API keys from SimplyBook.me
- [ ] Copied BOTH keys (API Key AND Secret Key)
- [ ] Added webhook URL: `https://api.clairehamilton.net/api/v1/webhooks/simplybook`
- [ ] Set retries to 3
- [ ] Enabled all 4 triggers (create, change, cancel, remind)
- [ ] Saved the webhook configuration
- [ ] Took screenshot of webhook settings
- [ ] Verified business information is correct
- [ ] Have at least 1 service configured
- [ ] Filled in the message template
- [ ] Ready to send via WhatsApp or email to Julian

---

## 📱 Contact

**Questions?** Message Julian anytime!

- This recipe is meant to be EASY
- If you get stuck, just send a screenshot and ask
- No such thing as a silly question!

---

## 🌟 Chef's Final Notes

You're doing great! This is literally the last step before your booking system goes live. I've already built all the technical infrastructure (the hard part) - this is just connecting the pieces together.

Think of it like this:

- ✅ I built the restaurant kitchen (done)
- ✅ I installed all the appliances (done)
- ✅ I wrote the menu system (done)
- 👉 You're just plugging in the power cord (this recipe)

**Total time you'll spend:** 15 minutes max
**Total coding required from you:** ZERO
**Impact:** Clients can start booking immediately after this!

You've got this! 💪

---

**Recipe created:** November 12, 2025  
**Last updated:** November 12, 2025  
**Version:** 1.0 (Recipe format by request)  
**Author:** Julian Della Bosca (Your Developer)  
**For:** Claire Hamilton (Platform Owner)

---

## 📸 Example Screenshots (What You're Looking For)

### Where to find API settings:

- Look for "Settings" → "For Development" → "API"
- You'll see fields for generating keys and adding webhook URL

### What API Keys look like:

- Long strings of random letters and numbers
- Usually 40-64 characters long
- Example format: `f3c86908989b8625161c7f55aea014d78f8c690a276903b20531015cdfb8c8`

### Webhook URL field:

- Will say "Callback URL" or "Webhook URL"
- Paste: `https://api.clairehamilton.net/api/v1/webhooks/simplybook`
- Make sure there's no spaces before or after!

---

**🍳 Happy cooking! You're almost there!**

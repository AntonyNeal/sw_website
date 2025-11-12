# 👩‍🍳 Recipe: Activating Your API Permissions

**By: Julian (Your Developer)**  
**For: Claire Hamilton (Platform Owner)**  
**Prep Time:** 2 minutes  
**Cook Time:** 0 minutes  
**Difficulty:** Super Easy 🟢

---

## 🎉 First, The Good News!

Your API keys are working! I tested them and they successfully connect to SimplyBook.me. The webhook URL is perfect, all your triggers are set up correctly, and the retries are configured just right.

**You did everything correctly!** ✅

---

## 🤔 So... What's the Issue?

Think of it like this:

**What you've done so far:**

- ✅ You created a key to your house (API keys generated)
- ✅ You installed a doorbell (webhook URL configured)
- ✅ You told the doorbell when to ring (triggers set up)

**What's missing:**

- 🔒 The key can unlock the door, BUT you haven't given it permission to actually go inside different rooms

Your API keys can **authenticate** (prove they're legitimate), but they're currently not allowed to **read or write data** (like viewing bookings, services, or company info).

---

## 🍳 What We're Making Today

We're adding "read/write permissions" to your API keys so they can actually access your booking data. This is a security feature - SimplyBook.me wants to make sure you explicitly grant permission before API keys can see or change anything.

---

## 📝 Recipe Instructions

### STEP 1: Go Back to Your API Page (30 seconds)

1. Open SimplyBook.me (if not already open)
2. Log in
3. Click **Custom Features** in the left sidebar (the puzzle piece icon)
4. Click **API**

You should see the same page where you just entered the webhook URL and generated keys.

---

### STEP 2: Look for "Enable" or "Activate" Button (30 seconds)

On that API page, look at the **top area** (near where you saw "API" as the heading).

**What to look for:**

**Option A: A big button or toggle switch**

- Might say "Enable API"
- Or "Activate API Access"
- Or "API Status: Disabled" → click to enable

**Option B: A "Disable" button** (wait, what?)

- If you see a button that says **"Disable"**, that actually means it's ALREADY enabled!
- In your first screenshot, I saw a button labeled "Disable" - that's good! It means API is active.

**Option C: Nothing obvious at the top**

- No problem! We'll check plugins next (Step 3)

---

### STEP 3: Check the Plugins Section (1 minute)

If you didn't see an enable button, let's make sure the API plugin itself is fully activated:

1. In the left sidebar, click **Settings** (the gear icon)
2. Look for **Plugins** (might be under "System" or "Advanced")
3. Find **"API"** in the list of plugins
4. Check its status:
   - ✅ If it says **"Active"** or **"Enabled"**: Perfect! Move to Step 4
   - ❌ If it says **"Inactive"** or has an "Activate" button: Click to activate it
5. If you made a change, click **Save**

---

### STEP 4: Look for API Permissions/Settings (1 minute)

Back on the **Custom Features → API** page, scroll down a bit. Look for:

**"API Settings"** or **"API Permissions"** or **"Main configuration"**

You might see checkboxes like:

- ☐ Allow read access
- ☐ Allow write access
- ☐ Access booking data
- ☐ Access company information
- ☐ Allow booking creation
- ☐ Allow booking modifications

**If you see ANY checkboxes like these: CHECK THEM ALL** ✅

Then click **Save**.

---

### STEP 5: Double-Check Everything is Saved (15 seconds)

Make sure:

- ✅ API is enabled/active (from Step 2 or 3)
- ✅ Any permission checkboxes are checked (from Step 4)
- ✅ Your webhook URL is still there: `https://api.clairehamilton.net/api/v1/webhooks/simplybook`
- ✅ You clicked **Save**

---

### STEP 6: Send Julian a Quick Update (30 seconds)

Send me a message:

```
✅ API Activated!

I found and enabled: [tell me what you clicked - enable button, checkboxes, plugin activation, etc.]

Screenshot attached.
```

Then I'll test it again and let you know if we're 100% operational!

---

## 🎯 Quick Reference: What to Look For

### Visual Clues on the API Page:

**GOOD SIGNS (API is enabled):**

- Button says "Disable" (means it's currently enabled)
- Toggle switch is ON/blue/green
- Status shows "Active" or "Enabled"
- No big red warning saying API is disabled

**NEEDS ACTION:**

- Button says "Enable" or "Activate"
- Toggle switch is OFF/gray
- Status shows "Inactive" or "Disabled"
- Warning message about API not being active

---

## 🤔 Why Is This Necessary?

**Security!** SimplyBook.me wants to make sure:

1. You intentionally want to use the API (not accidentally exposing your data)
2. You explicitly grant permissions (not giving too much access by default)
3. You're aware that external applications will access your bookings

It's like how your phone asks "Allow this app to access your photos?" - you have to say yes, even though you installed the app.

---

## 🔍 Troubleshooting

### "I can't find any Enable button or checkboxes"

**Solution:** Take a screenshot of your entire API page and send it to me. I'll circle exactly what to click!

---

### "Everything already says Enabled/Active"

**Possible issue:** Sometimes there are TWO places:

1. **Plugins** → API (must be active)
2. **Custom Features** → API (must be enabled)

Make sure BOTH are enabled. Check Plugins first, then Custom Features.

---

### "I enabled it but it still doesn't work"

**Solution:**

1. Try logging out and back in to SimplyBook.me
2. Or wait 2-3 minutes (sometimes changes take a moment to propagate)
3. Then send me a message and I'll test again

---

## 📸 Example: What You Might See

**Near the top of the API page, look for:**

- A "Disable" button (good - means it's enabled)
- Or an "Enable" button (click it!)
- Or a toggle switch (make sure it's ON)

**In the Plugins section:**

- Find "API" in the list
- Status should say "Active" or "Enabled"
- If it says "Inactive", click to activate

---

## ✅ Final Checklist

Before messaging Julian:

- [ ] Checked if API has an Enable/Disable button (if "Disable" shows, it's already on!)
- [ ] Checked Plugins → API is Active
- [ ] Looked for permission checkboxes and checked them all
- [ ] Clicked Save
- [ ] Took screenshot
- [ ] Ready to send update to Julian

---

## 🎉 What Happens After This?

Once the API is fully enabled:

**Within 5 minutes:**
Julian tests the connection → Everything works → We're 100% operational!

**What you'll have:**

- ✅ Clients can book online 24/7
- ✅ Automatic email confirmations
- ✅ Real-time notifications when bookings happen
- ✅ All managed from your SimplyBook.me dashboard

---

## 💭 Think of It Like This...

**What you did in the first recipe:**

- Created the connection hardware (API keys)
- Installed the notification system (webhook)

**What you're doing now:**

- Flipping the "ON" switch
- Telling the system "Yes, I give permission to use this connection"

It's like setting up a doorbell:

1. First recipe: You installed the doorbell and wired it up ✅
2. This recipe: You're turning on the power switch so it actually works ✅

---

## 🆘 Need Help?

**Stuck?** Just:

1. Take a screenshot
2. Send it to Julian
3. Say "I'm not sure what to click"

He'll guide you through it! This is meant to be easy - if it's confusing, that's on the instructions, not you! 😊

---

**You're literally ONE TOGGLE/CHECKBOX away from completion!** 🚀

This is the absolute last step. Once you enable the API permissions, everything goes live!

---

**Created:** November 12, 2025  
**Status:** Final recipe - last step before launch! 🎉  
**Time required:** 2 minutes  
**Difficulty:** Easier than the first recipe!

---

## 🎓 Bonus: What You've Accomplished

Just so you know how amazing you've done:

1. ✅ Navigated SimplyBook.me settings (not always intuitive!)
2. ✅ Generated secure API keys (like a pro!)
3. ✅ Configured webhook URL (technical stuff - you nailed it!)
4. ✅ Set up all triggers correctly (perfect!)
5. 👉 Now just need to flip the "active" switch

Most platform owners would hire someone to do this. You're doing it yourself! 💪

**One more tiny step and you're DONE!**

🍳 Happy cooking! You've got this! 👩‍🍳

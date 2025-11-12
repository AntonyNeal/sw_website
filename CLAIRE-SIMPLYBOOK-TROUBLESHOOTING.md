# 🔧 SimplyBook.me Troubleshooting Guide for Claire

**From: Julian (Your Developer)**  
**Date: November 12, 2025**

---

## ✅ GOOD NEWS: You're Already in the Right Place!

Looking at your screenshots, **you ARE in the correct section!** The API page you're seeing is EXACTLY where you need to be. The confusion is that the help guide shows an older interface, but yours is the newer version.

---

## 📸 What I Can See in Your Screenshots:

### Screenshot 1 (Your Current View): ✅ CORRECT!

You're looking at:

- **Custom Features** → **API** (in the left sidebar - I can see it's highlighted in blue)
- API keys displayed (partially visible)
- Webhook triggers section
- Callback URL field (at the bottom)
- "Number of API retries" setting

**THIS IS PERFECT!** This is the API development page we need!

### Screenshot 2 (Help Guide):

Shows an older interface layout - ignore this, your interface is newer and better!

---

## 🎯 What You Need to Do RIGHT NOW

You're literally 5 minutes away from being done! Here's what to do on the page you're currently looking at:

---

### STEP 1: Scroll Down to Find "Callback URL" Field

On the page you're on right now, **scroll down** until you see a field labeled **"Callback URL"**.

It should look like an empty text box.

---

### STEP 2: Enter the Webhook URL

In that **Callback URL** field, carefully type (or copy/paste) this EXACT address:

```
https://api.clairehamilton.net/api/v1/webhooks/simplybook
```

**IMPORTANT:**

- No spaces before or after
- Check for typos carefully
- The entire URL should be on one line

---

### STEP 3: Set API Retries

Look for **"Number of API retries"** - I can see it in your screenshot showing "0".

**Change this to: 3**

---

### STEP 4: Verify Webhook Triggers

Look for the webhook trigger checkboxes. I can see these in your screenshot:

- ✅ **Trigger on create** (should be checked)
- ✅ **Trigger on change** (should be checked)
- ✅ **Trigger on cancel** (should be checked)
- ✅ **Trigger on remind** (should be checked)

Make sure ALL FOUR are checked/enabled (blue).

---

### STEP 5: Save Everything

Look for a **"Save"** button (probably blue, at the bottom of the page).

Click it!

---

### STEP 6: Take a Screenshot

After you save, take a screenshot of the entire page showing:

- The Callback URL you entered
- The webhook triggers enabled
- The API retries set to 3

---

### STEP 7: Copy Your API Keys

Now scroll back UP to the top of the same page where you can see:

**"Your API key:"**

```
f3c86908989b8625161c7f55aea014d78f8c690a276903b20531015cdfb8c8
```

**"Your secret API key:"**

```
58dabce655975aea2e0d90e57812c79136875a3a48fe906ec7cceede9597a
```

---

### STEP 8: Generate FRESH Keys (IMPORTANT!)

**DO NOT use the keys shown above!** Those are old and don't work.

1. Look for a button that says **"Generate new keys"** (I can see it in your screenshot - it's a blue button)
2. Click it
3. Two NEW long text strings will appear
4. Copy BOTH of them

---

### STEP 9: Send Everything to Julian

Send me a WhatsApp message with:

```
✅ SimplyBook.me API Setup Complete!

NEW API KEY:
[paste the new API key here - the first long string]

NEW SECRET API KEY:
[paste the new secret key here - the second long string]

✅ Webhook URL configured: https://api.clairehamilton.net/api/v1/webhooks/simplybook
✅ Retries set to: 3
✅ All triggers enabled

Screenshot attached.
```

---

## 🎯 Summary: What To Do Right Now

You're on the right page! Just need to:

1. ✅ You're already in: **Custom Features** → **API** (left sidebar)
2. 📝 Scroll down to **Callback URL** field
3. ✨ Enter: `https://api.clairehamilton.net/api/v1/webhooks/simplybook`
4. 🔢 Set **API retries** to **3**
5. ✅ Verify all 4 webhook triggers are enabled
6. 💾 Click **Save**
7. 📸 Take screenshot
8. 🔑 Scroll back up and click **"Generate new keys"** button
9. 📋 Copy BOTH new keys
10. 📱 Send keys + screenshot to Julian via WhatsApp

**Total time: 5 minutes**

---

## ❓ Common Questions

### Q: "Why does my interface look different from the help guide?"

**A:** SimplyBook.me updated their interface. Your version is newer! The help guide screenshots are outdated. You're seeing the correct, modern interface.

---

### Q: "Am I in the wrong place?"

**A:** NO! You're in EXACTLY the right place! The page you're looking at (with API keys, webhook triggers, callback URL) is EXACTLY what we need. Perfect! ✅

---

### Q: "What is the API section for?"

**A:** This connects your SimplyBook.me account to Julian's custom booking system. Think of it like giving your booking system permission to talk to your website automatically.

---

### Q: "Do I need to go to other settings?"

**A:** For THIS task (connecting to Julian's system), NO! You're already exactly where you need to be. Just follow the 10 steps above and you're done!

Later, you can explore the other sections (Calendar, Services, etc.) to customize your booking options, but that's separate from this API setup.

---

### Q: "Why generate new keys when I already have keys?"

**A:** The old keys don't work (Julian tested them). Fresh keys will fix this. It takes 30 seconds - just click "Generate new keys" button and copy the new ones.

---

### Q: "What if I can't find the Callback URL field?"

**A:** It's definitely there! On the page you're currently on, scroll down. It might be below the fold. Look for a text field labeled "Callback URL" or "Webhook URL".

---

### Q: "Can I mess this up?"

**A:** Nope! Worst case, you enter a typo in the webhook URL and Julian just says "hey can you check that URL?" and you fix it. Everything is reversible. You can regenerate keys unlimited times. Zero risk!

---

## 🆘 Still Stuck?

If you're still having trouble:

1. **Take a screenshot** of exactly what you're seeing
2. **Send it to Julian** via WhatsApp
3. He'll give you the next step

But honestly, from your screenshots, you're 95% there! Just scroll down, enter the webhook URL, save, generate new keys, and send them over. That's it!

---

## 🎉 You're So Close!

The hard part (finding the right page) is DONE. You're literally looking at the exact page we need. Just fill in that Callback URL field, save, get fresh keys, and send them over.

5 minutes and this is wrapped up! 💪

---

**Questions?** WhatsApp Julian anytime!

**You've got this!** 🚀

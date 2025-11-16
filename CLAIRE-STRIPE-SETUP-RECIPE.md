# Stripe Account Setup Recipe for Claire 💳✨

## Overview 📋

This recipe will guide you through setting up a Stripe account for your escort service and getting the API keys needed for Julian to integrate payment processing into your booking website. 🎉

## Prerequisites 📝

- Australian Business Number (ABN) - if you have one 🇦🇺
- Bank account details (BSB and account number) 🏦
- Government-issued ID (Driver's license or passport) 🪪
- Business email address 📧

## Step 1: Create Stripe Account 🚀

1. Go to https://stripe.com/au 🌐
2. Click **"Start now"** or **"Sign up"** 👆
3. Enter your email address and create a password 🔐
4. Verify your email by clicking the link Stripe sends you ✉️

## Step 2: Complete Business Profile 👤

1. Once logged in, Stripe will prompt you to complete your account setup 📊
2. Select **"Individual"** or **"Company"** depending on your business structure 🏢
   - Most escort services start as Individual/Sole Trader 💼
3. Fill in your business details:
   - Business name (can be discreet - e.g., "CH Consulting Services") 🤫
   - Industry: Select **"Personal Services"** or similar category 📂
   - Business description: Be professional and accurate - e.g., "Adult entertainment and companionship services" ✍️
   - Website URL: Your booking website URL (once live) 🌍

## Step 3: Provide Personal Information 🆔

1. Enter your personal details:
   - Full legal name 👤
   - Date of birth 🎂
   - Residential address 🏠
   - Phone number 📱
2. Upload ID verification:
   - Take a photo of your driver's license or passport 📸
   - Stripe uses this for identity verification (standard for all businesses) ✅

## Step 4: Add Banking Details 🏦

1. Navigate to **Settings** → **Bank accounts and scheduling** ⚙️
2. Click **"Add bank account"** ➕
3. Enter your Australian bank details:
   - BSB number 🔢
   - Account number 💳
   - Account holder name (must match your ID) 📝
4. Stripe will verify your bank account (usually instant or within 1-2 business days) ⏱️

## Step 5: Enable Payment Methods 💰

1. Go to **Settings** → **Payment methods** ⚙️
2. Ensure these are enabled:
   - ✅ Cards (Visa, Mastercard, Amex) 💳
   - ✅ Digital wallets (Apple Pay, Google Pay) 📱
   - Consider enabling: Bank transfers (BECS Direct Debit) 🏦

## Step 6: Get Your API Keys 🔑

This is what Julian needs to integrate payments: 🛠️

1. Click **Developers** in the left sidebar 👨‍💻
2. Click **API keys** 🗝️
3. You'll see two sets of keys: 👀

### Test Mode Keys (for development) 🧪

- **Publishable key** - starts with `pk_test_...` 🔓
- **Secret key** - starts with `sk_test_...` (keep this private!) 🤐

### Live Mode Keys (for real payments) 🎯

- Toggle to **Live mode** using the switch 🔄
- **Publishable key** - starts with `pk_live_...` 🔓
- **Secret key** - starts with `sk_live_...` (VERY IMPORTANT - keep secret!) 🔐🚨

## Step 7: Send Keys to Julian 📤

**IMPORTANT SECURITY INSTRUCTIONS:** 🔒⚠️

### Send Test Keys First (Safe to share via normal channels) ✅

Send Julian these for development:

```
Test Publishable Key: pk_test_xxxxxxxxxxxxx
Test Secret Key: sk_test_xxxxxxxxxxxxx
```

### Live Keys (Must be sent SECURELY) 🔐

**DO NOT send via regular email or chat!** ⛔❌

Options for secure sharing:

1. **In person** - show Julian the keys on your screen 👀
2. **1Password or LastPass** - share via password manager 🔑
3. **Encrypted message** - use Signal or WhatsApp 🔒
4. **Stripe Dashboard access** - Add Julian as a team member (safer option - see Step 8) 👥✨

## Step 8: (Recommended) Add Julian as Team Member Instead 👥⭐

This is SAFER than sharing API keys: 🛡️

1. Go to **Settings** → **Team and security** ⚙️
2. Click **Invite team member** ✉️
3. Enter Julian's email 📧
4. Set permissions:
   - ✅ Developer access 👨‍💻
   - ✅ View payment data 👀
   - ❌ Uncheck full account access (not needed) 🚫
5. Click **Send invite** 📨
6. Julian can then access the API keys himself without you sharing secrets 🎉

## Step 9: Configure Payment Settings ⚙️

1. **Business settings** → **Customer emails** 📧
   - Enable email receipts for customers ✉️
   - Customize email template with your branding 🎨
2. **Business settings** → **Branding** 🖼️
   - Upload your logo 📷
   - Set brand colors 🌈
   - This appears on payment pages and receipts 💳
3. **Business settings** → **Customer information** 📋
   - Decide what info to collect (name, email, phone) ✍️

## Step 10: Test the Integration 🧪✨

Once Julian has integrated Stripe: 🎉

1. Make a test booking on your website 📅
2. Use Stripe's test card numbers: 💳
   - **Success**: `4242 4242 4242 4242` ✅
   - Any future expiry date (e.g., 12/34) 📆
   - Any 3-digit CVC (e.g., 123) 🔢
3. Verify the payment appears in your Stripe Dashboard → Payments 👀
4. Check that you receive the confirmation email 📬

## Step 11: Go Live 🚀💸

When ready for real payments: 💰

1. Complete any remaining verification steps Stripe requests ✅
2. Ensure your bank account is verified 🏦
3. Send Julian the **Live API keys** (securely!) 🔐
4. Julian will switch the website to use live keys 🔄
5. Make a small real test payment to confirm everything works 💳
6. Check that funds appear in your Stripe balance 💵🎉

## Payment Schedule 📅💰

- **Default**: Stripe pays out every 2 business days to your bank account 🏦
- Can be changed to weekly or monthly in Settings → Bank accounts and scheduling ⚙️
- First payout may take 7-10 days (standard for new accounts) ⏳

## Fees 💵

Stripe Australia charges: 🇦🇺

- **1.75% + $0.30 AUD** per successful card charge 💳
- No monthly fees, no setup fees 🎉
- Only pay when you get paid 💰

Example: $500 booking = $9.05 fee, you receive $490.95 ✨

## Support 🆘💬

If you have issues: ❓

- Stripe support: support@stripe.com 📧
- Live chat in Stripe Dashboard (click ? icon) 💬
- Phone: Available for account-specific issues ☎️

## What Julian Needs From You 📋✅

Summary - send Julian: 👨‍💻

1. ✅ **Test API keys** (pk_test and sk_test) - for building the integration 🔑
2. ✅ **Live API keys** (pk_live and sk_live) - when ready to go live (send securely!) 🔐
3. ✅ Confirmation that your bank account is verified 🏦
4. ✅ Your preferred business name for receipts 📝

**OR BETTER**: Just invite Julian as a team member (Step 8) and he can access everything himself! 🎉⭐

---

## Troubleshooting 🔧❓

**"My account is restricted"** 🚫

- Stripe may request additional documentation for adult services 📄
- Provide: ABN (if you have one), business license, or additional ID 🪪
- Be honest about your business type - hiding it can cause account closure ⚠️

**"Payment methods aren't working"** 💳❌

- Ensure account activation is complete ✅
- Check that bank account is verified 🏦
- Contact Stripe support if stuck 🆘

**"I don't have an ABN"** 🤔

- You can still use Stripe as a sole trader 👍
- Consider getting an ABN (free from ato.gov.au) - it professionalizes your business 💼
- Stripe may require it after a certain transaction volume 📊

---

Good luck! 🍀 Once you complete these steps, Julian will be able to integrate secure payment processing into your booking system. 💳✨🎉

- Julian 👨‍💻

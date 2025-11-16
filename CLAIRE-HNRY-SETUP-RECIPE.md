# Stripe + HNRY Setup Recipe for Claire 💳✨

## Why You Need BOTH Stripe AND HNRY 🤔

### The Perfect Combination 🎯

Your booking system needs **TWO separate services** that work together:

#### **Stripe = Payment Gateway** 💳

**What it does:** Collects money from customers

- ✅ Accepts credit/debit cards on your website
- ✅ Instant online payments when customers book
- ✅ Has an API so Julian can integrate it with your booking system
- ✅ Secure and trusted by customers worldwide
- ❌ Does NOT handle your taxes or accounting

#### **HNRY = Tax & Accounting** 📊

**What it does:** Manages your business finances

- ✅ Automatically calculates and pays your income tax
- ✅ Handles GST returns and ACC levies
- ✅ Tracks expenses and provides financial reports
- ✅ Acts as your accountant
- ❌ Does NOT have an API for accepting customer payments

### How They Work Together 🔄

```
Customer books → Stripe processes payment → Money goes to bank → HNRY deducts taxes → You get the rest
    (Website)         ($500 payment)         (2-3 days)        (auto tax calc)      (net income)
```

**Simple explanation:** Stripe gets the money IN, HNRY sorts the money OUT (taxes, etc.)

---

## Part 1: Set Up Stripe (Payment Collection) 💳

### Prerequisites 📝

- ABN (Australia) - optional but recommended 🇦🇺
- Bank account details 🏦
- Government-issued ID (Driver's license or passport) 🪪
- Business email address 📧

### Step 1: Create Stripe Account 🚀

1. Go to https://stripe.com/au 🌐
2. Click **"Sign up"** 👆
3. Enter your email address and create a password 🔐
4. Verify your email by clicking the link Stripe sends you ✉️

### Step 2: Complete Stripe Business Profile 👤

1. Once logged in, complete your account setup 📊
2. Select **"Individual"** (sole trader) or **"Company"** 💼
3. Fill in your business details:
   - Business name (e.g., "CH Consulting Services" if you want discretion) 🤫
   - Industry: Select appropriate category ✍️
   - Business description 📂
   - Website URL (your booking site once live) 🌍

### Step 3: Provide Personal Information to Stripe 🆔

1. Enter your personal details:
   - Full legal name 👤
   - Date of birth 🎂
   - Residential address 🏠
   - Phone number 📱
2. Upload ID verification:
   - Photo of driver's license or passport 📸
   - Stripe needs this for payment processing compliance ✅

### Step 4: Add Banking Details to Stripe 🏦

1. Go to **Settings** → **Bank accounts and scheduling** ⚙️
2. Click **"Add bank account"** ➕
3. Enter your Australian bank details:
   - BSB number 🔢
   - Account number 💳
   - Account holder name 📝
4. Stripe will verify your bank account ⏱️

### Step 5: Enable Stripe Payment Methods 💰

1. Go to **Settings** → **Payment methods** ⚙️
2. Enable these:
   - ✅ Cards (Visa, Mastercard, Amex) 💳
   - ✅ Digital wallets (Apple Pay, Google Pay) 📱
   - Consider: Bank transfers (BECS Direct Debit) 🏦

### Step 6: Get Stripe API Keys for Julian 🔑

Julian needs these to connect Stripe to your booking system: 🛠️

1. Click **Developers** in the left sidebar 👨‍💻
2. Click **API keys** 🗝️

**Test Keys** (for development): 🧪

- Publishable key: `pk_test_...`
- Secret key: `sk_test_...`

**Live Keys** (for real payments): 🎯

- Toggle to **Live mode**
- Publishable key: `pk_live_...`
- Secret key: `sk_live_...` ⚠️ Keep secret!

### Step 7: Add Julian as Stripe Team Member 👥

**RECOMMENDED** - Safer than sharing API keys:

1. Go to **Settings** → **Team and security** ⚙️
2. Click **Invite team member** ✉️
3. Enter Julian's email 📧
4. Set role: **Developer** or **Administrator** 👨‍💻
5. Click **Send invite** 📨

---

## Part 2: Set Up HNRY (Tax & Accounting) 📊

### Prerequisites 📝

- IRD number (NZ) or ABN (Australia) 🇳🇿🇦🇺
- Bank account details 🏦
- Government-issued ID 🪪
- Business email address 📧

### Step 8: Create HNRY Account 🚀

1. Go to https://hnry.co.nz (NZ) or https://hnry.com.au (Australia) 🌐
2. Click **"Get started"** 👆
3. Enter your email address and create a password 🔐
4. Verify your email ✉️

### Step 9: Complete HNRY Business Profile 👤

1. Select **"Sole trader"** (self-employed) 💼
2. Fill in your business details:
   - Trading name 📝
   - Business description ✍️
   - Services provided 📂
   - Expected annual income 💰

### Step 10: Provide Personal Information to HNRY 🆔

1. Enter your details:
   - Full legal name 👤
   - Date of birth 🎂
   - Address 🏠
   - Phone number 📱
   - IRD number (NZ) or ABN (Australia) 🔢
2. Upload ID verification:
   - Photo of license or passport 📸

### Step 11: Add Banking Details to HNRY 🏦

1. Go to **Settings** → **Bank accounts** ⚙️
2. Add your bank account:
   - Account name 📝
   - Account number 💳
   - BSB (if in Australia) 🔢

### Step 12: Add Julian as HNRY Team Member 👥

1. Go to **Settings** → **Team** ⚙️
2. Click **Invite team member** ✉️
3. Enter Julian's email 📧
4. Set permissions: **Admin** access 👨‍💻
5. Click **Send invite** 📨

---

## Part 3: Connect Stripe → Bank → HNRY 🔗

### The Money Flow 💸

Set up automatic flow from Stripe payments to HNRY tax handling:

**Option A: Stripe → Your Bank → HNRY** (Simpler)

1. Stripe pays out to your regular bank account
2. You manually transfer income to HNRY account
3. HNRY deducts taxes and pays you the rest

**Option B: Stripe → HNRY Account** (More Automated - Recommended) ⭐

1. Get your HNRY account number
2. Set Stripe payouts to go directly to HNRY account
3. HNRY automatically handles everything:
   - Deducts income tax
   - Deducts GST
   - Pays ACC levies
   - Transfers net income to your personal bank

### How to Set Up Option B 🎯

**In Stripe:**

1. Go to **Settings** → **Bank accounts and scheduling**
2. Update bank account to your **HNRY account number**
3. Stripe will now pay directly to HNRY

**In HNRY:**

1. Go to **Settings** → **Allocations**
2. Set where net income (after taxes) should go:
   - Your personal bank account
   - Savings
   - KiwiSaver (NZ)
   - Etc.

---

## Part 4: Testing Everything 🧪

### Test Stripe Payment 💳

1. Julian will add Stripe to your booking system
2. Make a test booking
3. Use Stripe test card: `4242 4242 4242 4242`
4. Expiry: any future date (e.g., 12/34)
5. CVC: any 3 digits (e.g., 123)
6. Verify payment appears in Stripe Dashboard

### Test HNRY Tax Calculation 📊

1. Create a test invoice in HNRY or wait for Stripe payout
2. Verify HNRY calculates taxes correctly
3. Check that net income goes to your bank account
4. Review tax breakdown in HNRY dashboard

---

## Part 5: Going Live 🚀

### Final Checklist ✅

**Stripe:**

- ✅ Account fully verified
- ✅ Bank account verified
- ✅ Julian has Live API keys or team access
- ✅ Payment methods enabled

**HNRY:**

- ✅ Account fully verified
- ✅ Bank account set up
- ✅ Allocations configured
- ✅ Julian has team access

**Connection:**

- ✅ Stripe payouts going to HNRY account (or your bank)
- ✅ Test payment successful
- ✅ Tax calculations verified

### Make First Real Payment 💰

1. Switch booking system to Stripe Live mode
2. Make a small real test booking ($5-10)
3. Verify:
   - Payment appears in Stripe
   - Money reaches HNRY (or your bank)
   - HNRY deducts taxes correctly
   - Net income arrives in your account

---

## Understanding the Costs 💵

### Stripe Fees 💳

- **1.75% + $0.30 AUD** per transaction
- Example: $500 booking = $9.05 fee
- You receive: $490.95

### HNRY Fees 📊

- **1% + GST** of your income (capped at $1,500+GST/year)
- Example: $10,000 income = $100 + GST HNRY fee
- Includes ALL tax, accounting, and reporting

### Total Example 🧮

Customer pays $500 for booking:

- Stripe fee: -$9.05
- Goes to HNRY: $490.95
- HNRY fee (1%): -$4.91
- Income tax (≈30%): -$147.28
- GST: handled by HNRY
- **You receive: ≈$328.76** (net income after all fees and taxes)

---

## Support & Contacts 🆘

### Stripe 💳

- Email: support@stripe.com
- Live chat in dashboard
- Phone: Available for account issues

### HNRY 📊

- Email: support@hnry.co.nz (NZ) or support@hnry.com.au (AU)
- Help: https://help.hnry.io
- Live chat in dashboard
- Phone support available

### Julian 👨‍💻

- For booking system integration
- For testing payments
- For troubleshooting

---

## Troubleshooting Common Issues 🔧

### "Stripe payment failed" 💳❌

- Check Stripe account is fully verified
- Ensure payment methods are enabled
- Verify test/live mode matches booking system
- Check customer entered valid card details

### "HNRY not receiving Stripe money" 🚫

- Verify Stripe payout account matches HNRY account
- Check Stripe payout schedule (usually 2-3 days)
- Confirm HNRY account is verified
- Contact HNRY support to verify account number

### "Tax calculations look wrong" 🤔

- HNRY calculates based on NZ/AU tax brackets
- Remember: includes income tax + GST + ACC
- Check your income year-to-date affects tax rate
- Contact HNRY accounting team for breakdown

### "Stripe wants more documentation" 📄

- Common for certain industries
- Provide: ABN, business license, additional ID
- Be honest about business type
- Stripe may restrict adult service accounts (check their policies)

---

## What Julian Needs From You 📋

### For Stripe 💳

- ✅ Team member invitation accepted, **OR**
- ✅ Test API keys: `pk_test_...` and `sk_test_...`
- ✅ Live API keys: `pk_live_...` and `sk_live_...` (when ready)

### For HNRY 📊

- ✅ Team member invitation accepted
- ✅ Your HNRY account number (if using Option B)
- ✅ Confirmation that account is verified

### For Testing 🧪

- ✅ Availability to test bookings together
- ✅ Confirmation when first real payment comes through

---

## Summary: Why This Setup Works Perfectly 🎯

**Stripe** handles what it's good at:

- ✅ Collecting payments from customers online
- ✅ Integrating with booking systems via API
- ✅ Trusted payment processing

**HNRY** handles what it's good at:

- ✅ Calculating and paying your taxes
- ✅ Managing ACC and GST
- ✅ Acting as your accountant
- ✅ Tracking expenses and income

**Together they give you:**

- 🚀 Professional online booking and payments
- 💰 Automatic tax management
- 📊 Full financial reporting
- 😌 Peace of mind - everything is handled properly
- ⏰ More time to focus on your business

---

Good luck! 🍀 This combination of Stripe + HNRY gives you a professional payment system with automatic tax handling - the best of both worlds! 💳✨📊

- Julian 👨‍💻

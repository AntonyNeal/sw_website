# HNRY Setup Recipe for Claire 💳✨

## The Simple Solution 🎯

**Good news!** You only need **ONE service** - HNRY handles EVERYTHING:

### What HNRY Does ✨

- ✅ **Accepts credit/debit card payments** (Visa, Mastercard) - at no extra cost!
- ✅ **Automatically calculates and pays your taxes** (income tax, GST, ACC)
- ✅ **Provides invoicing** - send professional invoices to clients
- ✅ **Tracks expenses** - claim deductions easily
- ✅ **Acts as your accountant** - files tax returns for you
- ✅ **Financial reporting** - see how your business is doing

### Why This is Perfect 🎉

- One account instead of managing multiple services
- No extra payment processing fees (unlike Stripe's 1.75% + $0.30)
- Julian will be added as admin to help with integration
- Everything in one place - payments, taxes, accounting

---

## Setup Steps 🚀

### Prerequisites 📝

- IRD number (NZ) or ABN (Australia) 🇳🇿🇦🇺
- Bank account details 🏦
- Government-issued ID (Driver's license or passport) 🪪
- Business email address 📧

- Government-issued ID (Driver's license or passport) 🪪
- Business email address 📧

### Step 1: Create HNRY Account 🚀

1. Go to https://hnry.co.nz (NZ) or https://hnry.com.au (Australia) 🌐
2. Click **"Get started"** 👆
3. Enter your email address and create a password 🔐
4. Verify your email ✉️

### Step 2: Complete HNRY Business Profile 👤

1. Select **"Sole trader"** (self-employed) 💼
2. Fill in your business details:
   - Trading name 📝
   - Business description ✍️
   - Services provided 📂
   - Expected annual income 💰

### Step 3: Provide Personal Information 🆔

1. Enter your details:
   - Full legal name 👤
   - Date of birth 🎂
   - Address 🏠
   - Phone number 📱
   - IRD number (NZ) or ABN (Australia) 🔢
2. Upload ID verification:
   - Photo of license or passport 📸

### Step 4: Add Banking Details 🏦

1. Go to **Settings** → **Bank accounts** ⚙️
2. Add your bank account:
   - Account name 📝
   - Account number 💳
   - BSB (if in Australia) 🔢

### Step 5: Enable Payment Collection 💳

HNRY can accept credit/debit card payments at **no extra cost**:

1. Go to **Settings** → **Payments** or **Invoicing** ⚙️
2. Enable card payments (Visa, Mastercard)
3. HNRY provides you with a payment link or invoicing system
4. Julian will need access to integrate this with your booking system

### Step 6: Add Julian as Admin 👥

**IMPORTANT** - Julian needs admin access to integrate payments:

1. Go to **Settings** → **Team** ⚙️
2. Click **Invite team member** ✉️
3. Enter Julian's email 📧
4. Set role: **Admin** 👨‍💻
5. Click **Send invite** 📨

---

## Part 2: Integration with Booking System 🔗

### What Julian Will Do 🛠️

Once Julian has admin access to HNRY:

1. **Research HNRY API** - Check if HNRY has payment API for booking integration
2. **Alternative: HNRY Invoicing** - If no API, Julian can set up automatic invoice generation
3. **Test Payments** - Make sure card payments work smoothly
4. **Connect to Booking System** - Integrate payment flow with your website

### Payment Flow Options 💸

**Option A: Direct HNRY Integration** (If API available) 🎯

```
Customer books → HNRY processes payment → HNRY deducts taxes → You get net income
   (Website)         (Card payment)         (automatic)         (to your bank)
```

**Option B: HNRY Invoicing** (If no API) 📧

```
Customer books → System sends HNRY invoice → Customer pays via HNRY link → You get net income
   (Website)        (automated email)           (Card payment)            (to your bank)
```

Julian will determine the best approach once he has access.

---

## Part 3: Testing Everything 🧪

### Test Payment Flow 💳

1. Julian will set up test payment
2. Make a test booking or invoice
3. Use your real card (small amount like $5)
4. Verify payment appears in HNRY dashboard
5. Check that tax is calculated correctly

### Verify Tax Calculation 📊

1. Review the payment in HNRY
2. Check tax breakdown:
   - Income tax deducted
   - GST handled
   - ACC levies calculated
3. Verify net income goes to your bank

---

## Part 4: Going Live 🚀

### Final Checklist ✅

- ✅ HNRY account fully verified
- ✅ Bank account set up and verified
- ✅ Card payments enabled
- ✅ Julian added as admin
- ✅ Booking system integration complete
- ✅ Test payment successful
- ✅ Tax calculations verified

### Make First Real Booking 💰

1. Go live with booking system
2. Make a small test booking
3. Verify:
   - Payment appears in HNRY
   - Tax deducted correctly
   - Net income arrives in your account

---

## Understanding the Costs 💵

### HNRY Fees 📊

- **1% + GST** of your income (capped at $1,500+GST/year)
- Example: $500 booking = $5 + GST HNRY fee
- **Includes:**
  - ✅ Payment processing (no extra card fees!)
  - ✅ Tax calculations and payments
  - ✅ Accounting and reporting
  - ✅ GST returns
  - ✅ ACC levies

### Example Breakdown 🧮

Customer pays $500 for booking:

- HNRY fee (1%): -$5.50 (includes GST)
- Income tax (≈30%): -$148.35
- GST: handled by HNRY
- **You receive: ≈$346.15** (net income after fees and taxes)

### Compare to Stripe + HNRY 💡

If you used Stripe + HNRY:

- Stripe fee: -$9.05
- HNRY fee: -$4.91
- Income tax: -$147.28
- **You'd receive: ≈$328.76**

**HNRY-only saves you ~$17 per booking!** 🎉

---

## Support & Contacts 🆘

### HNRY 📊

- Email: support@hnry.co.nz (NZ) or support@hnry.com.au (AU)
- Help: https://help.hnry.io
- Live chat in dashboard
- Phone support available

### Julian 👨‍💻

- For booking system integration
- For testing payments
- For troubleshooting
- Admin access to help manage HNRY

---

## Troubleshooting Common Issues 🔧

### "Payment failed" 💳❌

- Check HNRY account is fully verified
- Ensure card payments are enabled
- Verify customer entered valid card details
- Contact HNRY support

### "Tax calculations look wrong" 🤔

- HNRY calculates based on NZ/AU tax brackets
- Remember: includes income tax + GST + ACC
- Your year-to-date income affects tax rate
- Contact HNRY accounting team for breakdown

### "HNRY wants more documentation" 📄

- Provide: IRD/ABN, business info, additional ID
- Be honest about business type
- HNRY is discreet and professional

### "Can't integrate with booking system" 🔧

- Julian will check HNRY API availability
- May use HNRY invoicing as alternative
- Julian has admin access to explore options
- Contact HNRY support for integration help

---

## What Julian Needs From You 📋

### For HNRY Setup ✅

- ✅ Complete HNRY account setup
- ✅ Verify your account
- ✅ Enable card payments
- ✅ Send Julian admin invitation

### Once Julian Has Access 🛠️

- ✅ Julian will explore integration options
- ✅ Julian will set up payment flow
- ✅ You'll test together
- ✅ Julian will help troubleshoot issues

---

## Summary: Why HNRY-Only Works Perfectly 🎯

**HNRY handles everything:**

- ✅ Payment processing (card payments at no extra cost)
- ✅ Tax calculations and payments (income tax, GST, ACC)
- ✅ Accounting and reporting
- ✅ Professional invoicing
- ✅ Expense tracking

**Benefits:**

- 🚀 One service instead of two
- 💰 Lower fees (saves ~$17 per $500 booking vs Stripe+HNRY)
- 📊 Everything in one place
- 😌 Julian as admin to help manage
- ⏰ More time to focus on your business

---

Good luck! 🍀 HNRY gives you professional payment processing AND automatic tax handling - the perfect all-in-one solution! 💳✨📊

- Julian 👨‍💻

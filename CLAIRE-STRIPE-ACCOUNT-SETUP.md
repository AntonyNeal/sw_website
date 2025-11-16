# Recipe: Setting Up Stripe Account and Adding Team Member

Hi Claire! This recipe will guide you through creating a Stripe account for your coaching business and adding Julian as a team member.

## Prerequisites

- Valid email address (preferably your business email)
- Business information ready
- Government-issued ID or business documentation
- Bank account details for payouts

## Part 1: Create Your Stripe Account

### Step 1: Sign Up for Stripe

1. Go to https://stripe.com
2. Click **"Start now"** or **"Sign up"**
3. Enter your email address and create a secure password
4. Click **"Create account"**

### Step 2: Verify Your Email

1. Check your email inbox for a verification email from Stripe
2. Click the verification link in the email
3. You'll be redirected back to Stripe

### Step 3: Complete Business Profile

Fill out the required business information:

1. **Business type**: Select "Individual" or "Company" (likely "Individual" for sole proprietorship)
2. **Business details**:
   - Legal business name
   - Business address
   - Phone number
   - Business description (e.g., "Life and Career Coaching Services")
   - Website URL (if available)

3. **Personal details**:
   - Full legal name
   - Date of birth
   - Home address
   - Last 4 digits of SSN or full SSN (for US) or equivalent ID

4. **Bank account details**:
   - Routing number
   - Account number
   - Account holder name

### Step 4: Complete Identity Verification

1. Stripe may request additional verification documents
2. Upload a government-issued ID (driver's license, passport, etc.)
3. Wait for verification (usually takes a few minutes to 24 hours)

### Step 5: Enable Payment Methods

1. Go to **Settings** → **Payment methods**
2. Enable the payment methods you want to accept:
   - ✅ Credit cards (Visa, Mastercard, American Express)
   - ✅ Debit cards
   - Consider: Apple Pay, Google Pay, ACH Direct Debit

## Part 2: Add Julian as a Team Member

### Step 6: Access Team Settings

1. Log in to your Stripe Dashboard at https://dashboard.stripe.com
2. Click on your profile icon (top right corner)
3. Select **"Team and security"** or go to **Settings** → **Team**

### Step 7: Invite Julian

1. Click **"Add team member"** or **"Invite team member"**
2. Enter Julian's email address: `[INSERT JULIAN'S EMAIL HERE]`
3. Select the appropriate role:
   - **Administrator**: Full access (recommended for your developer)
   - **Developer**: API access and technical features
   - **Analyst**: View-only access
   - **Support Specialist**: Limited access for customer support

   **Recommendation**: Choose **"Administrator"** or **"Developer"** so Julian can:
   - Access API keys
   - Configure webhooks
   - Set up payment integrations
   - View all transactions and customers

4. Click **"Send invite"**

### Step 8: Confirm Invitation

1. Stripe will send an invitation email to Julian
2. Julian will need to:
   - Click the invitation link in the email
   - Create a Stripe account (or log in if he already has one)
   - Accept the team invitation
3. Once accepted, Julian will appear in your Team list

## Part 3: API Keys - Julian Will Handle This

**You don't need to worry about API keys!**

Once Julian is added as a team member (Administrator or Developer role), he will:

- Access the API keys directly from the Stripe Dashboard
- Securely configure them in the booking system
- Handle all technical integration

**No need to send or share anything** - Julian will get what he needs once he accepts the team invitation.

## Part 4: Important Security Settings

### Step 9: Enable Two-Factor Authentication (2FA)

1. Go to **Settings** → **Team and security**
2. Click on your name
3. Under **Two-step authentication**, click **"Enable"**
4. Follow the prompts to set up 2FA using:
   - Authenticator app (Google Authenticator, Authy, etc.) - RECOMMENDED
   - SMS (less secure)

### Step 10: Review Security Settings

1. Enable **"Require two-step authentication"** for all team members
2. Review and set up **webhook endpoints** (Julian will help with this)
3. Check **radar rules** for fraud protection (Stripe's built-in fraud detection)

## Part 5: Test Mode First!

### Step 11: Start in Test Mode

- Always start development in **Test Mode** (toggle in top right of dashboard)
- Use test card numbers: `4242 4242 4242 4242`
- No real money is charged in test mode
- Switch to **Live Mode** only when ready to accept real payments

## What Happens Next?

After completing these steps:

1. ✅ You'll have a Stripe account
2. ✅ Julian will be added as a team member with access
3. ✅ Julian can access API keys to integrate Stripe into your booking system
4. ✅ You can start accepting payments for your coaching services

## Need Help?

- **Stripe Support**: https://support.stripe.com
- **Stripe Documentation**: https://stripe.com/docs
- **Contact Julian** if you need help with:
  - Integration with your booking system
  - Testing payments
  - Configuring specific payment features

## Timeline Estimate

- Account creation: 10-15 minutes
- Identity verification: Few minutes to 24 hours
- Adding team member: 2 minutes
- Total time: 15-30 minutes (plus verification wait time)

---

**Questions for Julian:**

- What's your email address for the Stripe team invitation?
- Do you want Administrator or Developer role access?

**Next Steps After This:**
Julian will integrate Stripe with your SimplyBook booking system so customers can pay when booking coaching sessions.

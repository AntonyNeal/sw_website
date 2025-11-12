# 🚀 SimplyBook.me Integration Guide

**Complete Step-by-Step Instructions**

---

## 📋 Overview

You have **3 integration options** for SimplyBook.me:

1. **🎯 Option 1: Iframe Embed** (Easiest - 15 minutes)
2. **🔗 Option 2: Direct Link** (Super Easy - 5 minutes)
3. **⚡ Option 3: API Integration** (Advanced - 6-8 hours)

**Recommendation for Claire:** Start with Option 1 (iframe), upgrade to Option 3 later if needed.

---

## 🎯 Option 1: Iframe Embed (RECOMMENDED TO START)

### What It Does:

Embeds SimplyBook.me's booking widget **directly in your modal** - looks like it's part of your site!

### Step 1: Get Your SimplyBook.me Booking URL

After Claire sets up her SimplyBook.me account, she'll get a URL like:

```
https://clairehamilton.simplybook.me
```

Or with custom domain:

```
https://book.clairehamilton.net
```

### Step 2: Update BookingModal.tsx

Replace the entire modal content with the iframe:

```tsx
// src/components/BookingModal.tsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { BookingModalProps } from '../types/booking.types';

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="presentation"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(30, 30, 40, 0.9) 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        ref={modalRef}
        className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          background:
            'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 25%, #d8dade 50%, #f5f5f5 75%, #e8e8e8 100%)',
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        {/* Chrome Edge Highlight */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.08) 100%)',
          }}
        />

        {/* Header */}
        <div
          className="sticky top-0 p-4 flex justify-between items-center relative z-10 rounded-t-2xl"
          style={{
            background: 'linear-gradient(135deg, #d0d4d8 0%, #e8eaed 50%, #d0d4d8 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <h2
            id="modal-title"
            className="text-xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 0 rgba(255,255,255,0.5)',
              letterSpacing: '0.5px',
            }}
          >
            Book Your Experience
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-all"
            aria-label="Close booking modal"
            style={{
              background: 'linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.6)',
            }}
          >
            <X size={20} style={{ color: '#4a5568' }} />
          </button>
        </div>

        {/* SimplyBook.me Iframe */}
        <div className="relative z-10" style={{ height: 'calc(90vh - 80px)' }}>
          <iframe
            src="https://clairehamilton.simplybook.me" // ← CHANGE THIS TO CLAIRE'S URL
            className="w-full h-full border-0"
            title="Booking Calendar"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Update the URL

In the iframe `src`, change:

```tsx
src = 'https://clairehamilton.simplybook.me';
```

To Claire's actual SimplyBook.me URL (she'll get this after signup).

### ✅ Done! That's It!

**Pros:**

- ✅ 15 minutes to implement
- ✅ Looks integrated with your site
- ✅ Claire manages everything in SimplyBook.me dashboard
- ✅ No API complexity
- ✅ Works immediately

**Cons:**

- ⚠️ Slight iframe styling limitations
- ⚠️ No deep customization

---

## 🔗 Option 2: Direct Link (SIMPLEST)

### What It Does:

Opens SimplyBook.me in a **new tab** instead of modal.

### Implementation:

Update the "Book Now" buttons to open the link directly:

```tsx
// In Home.tsx, About.tsx, Services.tsx, Prices.tsx

// OLD:
<button
  onClick={() => setIsBookingOpen(true)}
  // ... styles
>
  Book Now
</button>

// NEW:
<a
  href="https://clairehamilton.simplybook.me" // ← CLAIRE'S URL
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block" // Same styles as button
  // ... all the same styles
>
  Book Now
</a>
```

### Even Simpler - Keep Modal But Replace Content:

```tsx
// In BookingModal.tsx - just add a link:

<div className="p-8 text-center">
  <h3 className="text-2xl font-bold mb-4">Ready to Book?</h3>
  <p className="mb-6">Click below to view availability and schedule your experience.</p>
  <a
    href="https://clairehamilton.simplybook.me"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block px-8 py-4 rounded-lg font-bold"
    style={{
      background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
      color: '#ffffff',
      // ... chrome styling
    }}
  >
    Open Booking Calendar →
  </a>
</div>
```

### ✅ Done!

**Pros:**

- ✅ 5 minutes to implement
- ✅ Zero complexity
- ✅ Claire manages everything
- ✅ Opens in new tab (professional)

**Cons:**

- ⚠️ Takes user away from your site
- ⚠️ Less seamless experience

---

## ⚡ Option 3: Full API Integration (ADVANCED)

### What It Does:

**Complete control** - fetch availability, create bookings, all within your site using SimplyBook.me's API.

### When To Use:

- You want custom booking flow
- Need deep integration with your site
- Want to track analytics
- Planning to add payment processing later

### Setup Steps:

#### 1. Get API Credentials

Claire needs to:

1. Log in to SimplyBook.me
2. Go to Settings → Integrations → API
3. Enable API access
4. Copy:
   - **Company Login**: `clairehamilton` (or similar)
   - **API Key**: `xxxxx-xxxxx-xxxxx-xxxxx`

#### 2. Create Environment Variables

```bash
# .env.local
VITE_SIMPLYBOOK_COMPANY=clairehamilton
VITE_SIMPLYBOOK_API_KEY=your-api-key-here
```

#### 3. Install Dependencies

```bash
npm install axios date-fns
```

#### 4. Create API Service

```typescript
// src/services/simplybook.service.ts

import axios from 'axios';

const SIMPLYBOOK_API_URL = 'https://user-api.simplybook.me';

interface SimplybookConfig {
  company: string;
  apiKey: string;
}

class SimplybookService {
  private config: SimplybookConfig;
  private token: string | null = null;

  constructor() {
    this.config = {
      company: import.meta.env.VITE_SIMPLYBOOK_COMPANY || '',
      apiKey: import.meta.env.VITE_SIMPLYBOOK_API_KEY || '',
    };
  }

  // Authenticate
  async getToken(): Promise<string> {
    if (this.token) return this.token;

    const response = await axios.post(`${SIMPLYBOOK_API_URL}/admin/auth`, {
      company: this.config.company,
      login: this.config.apiKey,
    });

    this.token = response.data.token;
    return this.token;
  }

  // Get available services
  async getServices() {
    const token = await this.getToken();
    const response = await axios.get(`${SIMPLYBOOK_API_URL}/admin/services`, {
      headers: { 'X-Company-Login': this.config.company, 'X-Token': token },
    });
    return response.data;
  }

  // Get available time slots
  async getAvailability(serviceId: string, date: string) {
    const token = await this.getToken();
    const response = await axios.get(
      `${SIMPLYBOOK_API_URL}/admin/availability/${serviceId}/${date}`,
      {
        headers: { 'X-Company-Login': this.config.company, 'X-Token': token },
      }
    );
    return response.data;
  }

  // Create booking
  async createBooking(bookingData: {
    serviceId: string;
    providerId: string;
    date: string;
    time: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
  }) {
    const token = await this.getToken();
    const response = await axios.post(`${SIMPLYBOOK_API_URL}/admin/bookings`, bookingData, {
      headers: { 'X-Company-Login': this.config.company, 'X-Token': token },
    });
    return response.data;
  }
}

export const simplybookService = new SimplybookService();
```

#### 5. Update BookingModal with API Integration

```tsx
// src/components/BookingModal.tsx

import React, { useState, useEffect } from 'react';
import { simplybookService } from '../services/simplybook.service';

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load services on mount
  useEffect(() => {
    if (isOpen) {
      loadServices();
    }
  }, [isOpen]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await simplybookService.getServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async (serviceId: string, date: string) => {
    setLoading(true);
    try {
      const data = await simplybookService.getAvailability(serviceId, date);
      setAvailability(data);
    } catch (error) {
      console.error('Failed to load availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (bookingData: any) => {
    setLoading(true);
    try {
      await simplybookService.createBooking(bookingData);
      // Show success message
      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your modal UI with service selection, calendar, time slots, etc.
}
```

### ✅ Full Integration Complete!

**Pros:**

- ✅ Complete control
- ✅ Custom UI
- ✅ Seamless experience
- ✅ Analytics tracking
- ✅ Future-proof

**Cons:**

- ⚠️ 6-8 hours development time
- ⚠️ More maintenance
- ⚠️ Need API knowledge

---

## 📊 Which Option Should You Choose?

### Decision Matrix:

| Factor              | Option 1: Iframe | Option 2: Link | Option 3: API |
| ------------------- | ---------------- | -------------- | ------------- |
| **Setup Time**      | 15 mins          | 5 mins         | 6-8 hours     |
| **Difficulty**      | Easy             | Easiest        | Advanced      |
| **User Experience** | Great            | Good           | Excellent     |
| **Customization**   | Medium           | Low            | High          |
| **Maintenance**     | None             | None           | Medium        |
| **Cost**            | Free             | Free           | Dev time      |

### My Recommendation:

**Phase 1 (Week 1-2): Option 1 - Iframe Embed**

- Get Claire booking clients ASAP
- Zero complexity
- Professional appearance
- Works perfectly

**Phase 2 (Month 2-3): Option 3 - API Integration** (Optional)

- Only if you need custom features
- Only if you want deep analytics
- Only if iframe limitations bother you

---

## 🎯 Implementation Timeline

### Week 1: Iframe Integration (RECOMMENDED)

**Monday:**

- Claire signs up for SimplyBook.me (30 mins)
- Claire sets up 2-3 services (1 hour)
- Claire configures availability (30 mins)

**Tuesday:**

- You get Claire's booking URL
- You update BookingModal.tsx (15 mins)
- You test booking flow (15 mins)

**Wednesday:**

- Deploy to production
- Claire tests on her phone
- Make any adjustments

**Thursday-Friday:**

- Soft launch
- Monitor bookings
- Celebrate! 🎉

**Total Developer Time:** 30 minutes  
**Total Claire Time:** 2 hours

---

## 💻 Code Changes Required

### For Option 1 (Iframe) - RECOMMENDED:

**File to Change:** `src/components/BookingModal.tsx`

**What to Change:**

1. Replace entire content section with iframe
2. Update iframe `src` to Claire's URL
3. Test

**Lines of Code:** ~50 lines deleted, ~30 lines added

---

### For Option 2 (Direct Link):

**Files to Change:**

- `src/pages/Home.tsx`
- `src/pages/About.tsx`
- `src/pages/Services.tsx`
- `src/pages/Prices.tsx`

**What to Change:**

1. Replace button `onClick` with `<a href>`
2. Update URL to Claire's booking page
3. Test

**Lines of Code:** ~10 lines per file

---

### For Option 3 (API):

**Files to Create:**

- `src/services/simplybook.service.ts`
- `.env.local` (environment variables)

**Files to Change:**

- `src/components/BookingModal.tsx` (major rewrite)
- `package.json` (add dependencies)

**Lines of Code:** ~500+ lines

---

## 🚀 Quick Start Commands

### Install Dependencies (if needed):

```bash
cd c:\Repos\sw_website
npm install
```

### Test Locally:

```bash
npm run dev
```

### Deploy:

```bash
git add .
git commit -m "Integrate SimplyBook.me booking system"
git push
```

DigitalOcean will auto-deploy.

---

## 🔍 Testing Checklist

After integration, test:

### Desktop:

- [ ] Click "Book Now" button
- [ ] Modal/page opens correctly
- [ ] Can see available dates
- [ ] Can select time slot
- [ ] Can complete booking
- [ ] Receives confirmation email
- [ ] Close button works

### Mobile:

- [ ] Same tests as desktop
- [ ] Touch-friendly interface
- [ ] Scrolling works smoothly
- [ ] Text is readable
- [ ] Buttons are clickable

### Edge Cases:

- [ ] Close modal mid-booking (data lost? OK!)
- [ ] Press Escape key (modal closes? Good!)
- [ ] Open booking page directly (works? Yes!)
- [ ] Booking while Claire is busy (shows unavailable? Good!)

---

## 📱 Mobile App for Claire

**After website integration, Claire needs:**

1. **Download SimplyBook.me App:**
   - iOS: App Store → "SimplyBook.me Admin"
   - Android: Play Store → "SimplyBook.me Admin"

2. **Login:**
   - Email: (her email)
   - Password: (her password)

3. **Start Managing:**
   - Check today's bookings
   - Update availability
   - Reschedule if needed
   - View client details

**That's it!** She can manage everything from her phone. 📱

---

## 🎨 Customization Options

### SimplyBook.me Dashboard (Claire does this):

1. **Branding:**
   - Upload logo
   - Set colors to match silver theme
   - Add background image
   - Customize booking page text

2. **Services:**
   - 1-hour session
   - 2-hour session
   - Overnight experience
   - Custom packages

3. **Notifications:**
   - Email confirmation (auto)
   - SMS reminder 24h before (optional)
   - Email reminder 2h before
   - Follow-up after booking

4. **Intake Forms:**
   - Screening questions
   - Special requests field
   - Terms & conditions checkbox

---

## 🔒 Security & Privacy

### SimplyBook.me Provides:

✅ **SSL Encryption** - All data encrypted in transit  
✅ **GDPR Compliant** - European data protection standards  
✅ **ISO 27001 Certified** - Security audited  
✅ **Private Booking Pages** - Not publicly listed  
✅ **Client Data Protection** - Secure storage

### Your Responsibility:

- ⚠️ Don't expose API keys in client-side code (use backend proxy if API integration)
- ⚠️ Use HTTPS (already set up on clairehamilton.net)
- ⚠️ Don't store sensitive data in localStorage

---

## ❓ FAQ

### Q: Do we need to handle payments?

**A:** No! Not yet. Just booking/availability for now.

### Q: Can Claire customize the booking page?

**A:** Yes! Fully customizable in SimplyBook.me dashboard.

### Q: What if the iframe looks weird?

**A:** Adjust iframe height/width, or use Option 3 (API) for full control.

### Q: Can we track booking analytics?

**A:** Yes! SimplyBook.me has built-in analytics. Option 3 (API) gives you custom tracking.

### Q: What if SimplyBook.me goes down?

**A:** Rare, but booking modal will show error. We can add fallback to direct link.

### Q: Can we migrate later?

**A:** Yes! Start with iframe, upgrade to API later if needed.

---

## 🎯 Next Steps

**Right Now:**

1. Wait for Claire to sign up for SimplyBook.me
2. Wait for her booking URL
3. I'll implement Option 1 (iframe)
4. Test together
5. Deploy

**This Week:**

- Claire sets up services
- Claire configures availability
- You integrate (15 mins)
- Test & deploy

**Next Week:**

- Go live! 🚀
- Claire manages bookings from phone
- Monitor and optimize

---

## 📞 Support

**If You Get Stuck:**

1. **SimplyBook.me Support:** 24/7 live chat
2. **API Documentation:** https://simplybook.me/en/api/developer-api
3. **Help Center:** https://help.simplybook.me

**Common Issues:**

- **Iframe not showing:** Check URL, check CORS settings
- **API not working:** Verify API key, check token generation
- **Styling broken:** Adjust iframe height, check responsive CSS

---

## ✅ Summary

**Best Choice for You:** **Option 1 - Iframe Embed**

**Why:**

- ✅ 15 minutes to implement
- ✅ Professional appearance
- ✅ Claire manages everything easily
- ✅ No complexity
- ✅ Works perfectly for your needs

**When Claire gets her SimplyBook.me URL, let me know and I'll integrate it in 15 minutes!** 🚀

---

**Ready to integrate?** Just give me Claire's booking URL and I'll update the code! 💪

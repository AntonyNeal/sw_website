# 🚀 SimplyBook.me Quick Reference

**One-page cheat sheet for developers**

---

## 🔑 API Credentials

```bash
API Key:    f3c86908989b8625161c7f55aea014d78f8c690a276903b20531015cdfb8c8
Secret Key: 58dabce655975aea2e0d90e57812c79136875a3a48fe906ec7cceede9597a
Company:    clairehamilton
JSON-RPC:   https://user-api.simplybook.net/
REST API:   https://user-api-v2.simplybook.net/
```

---

## 🪝 Webhook Configuration

**Callback URL:**

```
https://api.clairehamilton.net/api/v1/webhooks/simplybook
```

**Triggers Enabled:**

- ✅ Trigger on create
- ✅ Trigger on change
- ✅ Trigger on cancel
- ✅ Trigger on remind

**Recommended Retries:** 3

---

## 📁 Files Created

| File                                    | Purpose            |
| --------------------------------------- | ------------------ |
| `api/services/simplybook.service.js`    | Main API service   |
| `api/controllers/webhook.controller.js` | Webhook handler    |
| `api/routes/webhook.routes.js`          | Webhook routes     |
| `api/test-simplybook.js`                | Connection test    |
| `SIMPLYBOOK-API-SETUP.md`               | Full documentation |

---

## 🧪 Quick Tests

### Test API Connection

```powershell
cd api
node test-simplybook.js
```

### Test Webhook

```powershell
curl http://localhost:3001/api/v1/webhooks/test
```

### Start Server

```powershell
cd api
npm start
```

---

## 💻 Code Examples

### Get Services

```javascript
const simplybookService = require('./services/simplybook.service');
const services = await simplybookService.getServices();
```

### Check Availability

```javascript
const slots = await simplybookService.getAvailability('service-id', '2025-11-15', 'provider-id');
```

### Create Booking

```javascript
const booking = await simplybookService.createBooking({
  serviceId: '1',
  providerId: '1',
  datetime: '2025-11-15 14:00:00',
  clientName: 'Jane Doe',
  clientEmail: 'jane@example.com',
  clientPhone: '+1234567890',
  comment: 'Special requests here',
});
```

---

## 🔗 Webhook Endpoints

| Method | Endpoint                      | Purpose            |
| ------ | ----------------------------- | ------------------ |
| POST   | `/api/v1/webhooks/simplybook` | Production webhook |
| GET    | `/api/v1/webhooks/test`       | Test endpoint      |
| POST   | `/api/v1/webhooks/test`       | Test webhook POST  |

---

## 📋 TODO Checklist

### Configuration

- [ ] Add webhook URL to SimplyBook.me dashboard
- [ ] Copy `.env.example` to `.env` in both root and `api/`
- [ ] Test API connection with `node test-simplybook.js`
- [ ] Test webhook endpoint

### Implementation

- [ ] Set up database for booking storage
- [ ] Configure SendGrid for emails
- [ ] Implement booking form in frontend
- [ ] Add analytics tracking
- [ ] Create admin dashboard

### Testing

- [ ] Test all 4 webhook event types
- [ ] End-to-end booking flow
- [ ] Error handling
- [ ] Load testing

---

## 🐛 Common Issues

### "Failed to authenticate"

→ Check API key in `.env` file  
→ Verify API is enabled in SimplyBook dashboard

### Webhook not receiving events

→ Verify callback URL in SimplyBook dashboard  
→ Check server is publicly accessible  
→ Review server logs

### CORS errors

→ Already configured for `*.clairehamilton.com.au`

---

## 📚 Resources

- **Full Setup Guide:** `SIMPLYBOOK-API-SETUP.md`
- **Integration Guide:** `SIMPLYBOOK-INTEGRATION-GUIDE.md`
- **Official API Docs:** https://simplybook.me/en/api/developer-api
- **Support:** 24/7 live chat in SimplyBook.me dashboard

---

## 🎯 Next Actions

1. **Update webhook URL** in SimplyBook.me (Settings → API → Callback URL)
2. **Create `.env` files** from `.env.example`
3. **Run test:** `node api/test-simplybook.js`
4. **Test booking** on SimplyBook.me
5. **Watch webhook** fire in server logs

---

**Last Updated:** November 12, 2025  
**Version:** 1.0.0

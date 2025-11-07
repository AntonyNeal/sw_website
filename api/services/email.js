const sgMail = require("@sendgrid/mail");

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("Warning: SENDGRID_API_KEY not found in environment variables");
}

const SENDER_EMAIL = process.env.SENDGRID_FROM_EMAIL || "bookings@yourdomain.com";
const SENDER_NAME = process.env.BUSINESS_NAME || "Service Booking Platform";
const BUSINESS_EMAIL = process.env.BUSINESS_NOTIFICATION_EMAIL || "notifications@yourdomain.com";

/**
 * Send booking confirmation email to customer
 */
async function sendBookingConfirmation(booking, customerInfo, serviceInfo) {
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const msg = {
    to: customerInfo.email,
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME,
    },
    subject: `Booking Confirmation - ${serviceInfo.name}`,
    text: `
Dear ${customerInfo.name},

Your booking has been confirmed! Here are the details:

BOOKING DETAILS:

Service: ${serviceInfo.name}
Date: ${new Date(booking.date).toLocaleDateString("en-US", { 
  weekday: "long", 
  year: "numeric", 
  month: "long", 
  day: "numeric" 
})}
Time: ${booking.startTime} - ${booking.endTime}
Duration: ${serviceInfo.duration} minutes
Location: ${booking.location || "Business location"}
Total: ${formatCurrency(booking.totalAmount, booking.currency)}

${booking.notes ? \`Special Requests: \${booking.notes}\` : ""}

CONTACT INFORMATION:

Business Phone: ${process.env.BUSINESS_PHONE || "Contact us"}
Business Email: ${BUSINESS_EMAIL}
${process.env.BUSINESS_ADDRESS ? \`Address: \${process.env.BUSINESS_ADDRESS}\` : ""}

Need to make changes to your booking? Contact us using the information above.

Best regards,
${SENDER_NAME} Team
    `.trim(),
    html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f4f4f4;
      }
      .container {
        background-color: white;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #2563eb;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      .confirmation-badge {
        background-color: #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        display: inline-block;
        margin-bottom: 10px;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #e5e7eb;
      }
      .detail-label {
        font-weight: bold;
        color: #374151;
      }
      .detail-value {
        color: #1f2937;
      }
      .total-row {
        background-color: #f9fafb;
        font-weight: bold;
        font-size: 18px;
        color: #2563eb;
      }
      .contact-section {
        background-color: #f9fafb;
        padding: 20px;
        border-radius: 6px;
        margin-top: 30px;
      }
      .footer {
        text-align: center;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        color: #6b7280;
        font-size: 14px;
      }
      .button {
        display: inline-block;
        background-color: #2563eb;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="confirmation-badge"> CONFIRMED</div>
        <h1>Booking Confirmation</h1>
        <p>Hi ${customerInfo.name}, your booking is confirmed!</p>
      </div>

      <h2> Booking Details</h2>
      <div class="detail-row">
        <span class="detail-label">Service:</span>
        <span class="detail-value">${serviceInfo.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date:</span>
        <span class="detail-value">${new Date(booking.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time:</span>
        <span class="detail-value">${booking.startTime} - ${booking.endTime}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Duration:</span>
        <span class="detail-value">${serviceInfo.duration} minutes</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Location:</span>
        <span class="detail-value">${booking.location || "Business location"}</span>
      </div>
      <div class="detail-row total-row">
        <span class="detail-label">Total:</span>
        <span class="detail-value">${formatCurrency(booking.totalAmount, booking.currency)}</span>
      </div>
      
      ${booking.notes ? \`
        <div class="detail-row">
          <span class="detail-label">Special Requests:</span>
          <span class="detail-value">\${booking.notes}</span>
        </div>
      \` : ""}

      <div class="contact-section">
        <h3> Contact Information</h3>
        <p><strong>Phone:</strong> ${process.env.BUSINESS_PHONE || "Contact us"}</p>
        <p><strong>Email:</strong> ${BUSINESS_EMAIL}</p>
        ${process.env.BUSINESS_ADDRESS ? \`<p><strong>Address:</strong> \${process.env.BUSINESS_ADDRESS}</p>\` : ""}
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p>Need to make changes to your booking? Contact us using the information above.</p>
      </div>
    </div>

    <div class="footer">
      <p>This is an automated confirmation from ${SENDER_NAME}</p>
      <p> ${new Date().getFullYear()} ${SENDER_NAME}</p>
    </div>
  </body>
  </html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(\` Booking confirmation sent to \${customerInfo.email}\`);
    return { success: true };
  } catch (error) {
    console.error(" Failed to send booking confirmation:", error);
    throw error;
  }
}

/**
 * Send booking notification to business
 */
async function sendBookingNotification(booking, customerInfo, serviceInfo) {
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const msg = {
    to: BUSINESS_EMAIL,
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME,
    },
    subject: \`New Booking: \${serviceInfo.name} - \${customerInfo.name}\`,
    text: \`
New booking received!

BOOKING DETAILS:

Booking ID: \${booking.id}
Service: \${serviceInfo.name}
Date: \${new Date(booking.date).toLocaleDateString("en-US", { 
  weekday: "long", 
  year: "numeric", 
  month: "long", 
  day: "numeric" 
})}
Time: \${booking.startTime} - \${booking.endTime}
Duration: \${serviceInfo.duration} minutes
Total: \${formatCurrency(booking.totalAmount, booking.currency)}

CUSTOMER INFORMATION:

Name: \${customerInfo.name}
Email: \${customerInfo.email}
Phone: \${customerInfo.phone || "Not provided"}

\${booking.notes ? \`Special Requests: \${booking.notes}\` : ""}

View full details in your admin dashboard.

Best regards,
System Notifications
    \`.trim(),
    html: \`
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .alert { background-color: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 20px; }
      .detail-grid { background-color: #f9fafb; padding: 20px; border-radius: 6px; }
      .detail-row { margin: 10px 0; }
      .label { font-weight: bold; color: #374151; }
      .footer { margin-top: 30px; color: #6b7280; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="alert">
        <h2> New Booking Received</h2>
        <p>A new booking has been submitted and confirmed.</p>
      </div>

      <div class="detail-grid">
        <h3> Booking Information</h3>
        <div class="detail-row">
          <span class="label">Booking ID:</span> \${booking.id}
        </div>
        <div class="detail-row">
          <span class="label">Service:</span> \${serviceInfo.name}
        </div>
        <div class="detail-row">
          <span class="label">Date:</span> \${new Date(booking.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric", 
            month: "long",
            day: "numeric"
          })}
        </div>
        <div class="detail-row">
          <span class="label">Time:</span> \${booking.startTime} - \${booking.endTime}
        </div>
        <div class="detail-row">
          <span class="label">Total:</span> \${formatCurrency(booking.totalAmount, booking.currency)}
        </div>
      </div>

      <div class="detail-grid">
        <h3> Customer Information</h3>
        <div class="detail-row">
          <span class="label">Name:</span> \${customerInfo.name}
        </div>
        <div class="detail-row">
          <span class="label">Email:</span> \${customerInfo.email}
        </div>
        <div class="detail-row">
          <span class="label">Phone:</span> \${customerInfo.phone || "Not provided"}
        </div>
        \${booking.notes ? \`
          <div class="detail-row">
            <span class="label">Special Requests:</span> \${booking.notes}
          </div>
        \` : ""}
      </div>
    </div>

    <div class="footer">
      <p>This is an automated notification from \${SENDER_NAME}</p>
      <p> \${new Date().getFullYear()} \${SENDER_NAME}</p>
    </div>
  </body>
  </html>
    \`,
  };

  try {
    await sgMail.send(msg);
    console.log(\` Booking notification sent to business\`);
    return { success: true };
  } catch (error) {
    console.error(" Failed to send booking notification:", error);
    throw error;
  }
}

/**
 * Send test email to verify SendGrid configuration
 */
async function sendTestEmail(recipientEmail) {
  const msg = {
    to: recipientEmail,
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME,
    },
    subject: "Test Email - Service Booking Platform",
    text: "This is a test email from your Service Booking Platform. If you received this, SendGrid is configured correctly!",
    html: \`
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 500px; margin: 0 auto; padding: 20px; }
      .success { background-color: #d1fae5; border: 1px solid #10b981; padding: 20px; border-radius: 6px; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="success">
        <h2> Email Test Successful!</h2>
        <p>Your email configuration is set up correctly.</p>
      </div>
      <p style="margin-top: 30px;">This is a test email from your <strong>Service Booking Platform</strong>.</p>
      <p>If you received this, your SendGrid integration is configured correctly and ready to send booking confirmations!</p>
      <p><small>Sent at: \${new Date().toISOString()}</small></p>
    </div>
  </body>
  </html>
    \`,
  };

  try {
    await sgMail.send(msg);
    console.log(\` Test email sent to \${recipientEmail}\`);
    return { 
      success: true, 
      message: \`Test email successfully sent to \${recipientEmail}\`
    };
  } catch (error) {
    console.error(" Failed to send test email:", error);
    throw error;
  }
}

module.exports = {
  sendBookingConfirmation,
  sendBookingNotification,
  sendTestEmail,
};

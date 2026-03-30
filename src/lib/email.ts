import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.EMAIL_FROM || 'Giftora <noreply@giftora.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function baseTemplate(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Giftora</title>
</head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background:#0d1117;padding:32px 40px;text-align:center;">
            <span style="font-size:28px;font-weight:700;color:#c8941e;letter-spacing:3px;font-family:Georgia,serif;">GIFTORA</span>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:40px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f4ede2;padding:24px 40px;text-align:center;font-size:12px;color:#9a7453;">
            <p style="margin:0 0 8px;">© ${new Date().getFullYear()} Giftora. All rights reserved.</p>
            <p style="margin:0;">
              <a href="${APP_URL}/policies/privacy" style="color:#c8941e;text-decoration:none;">Privacy Policy</a> ·
              <a href="${APP_URL}/policies/terms" style="color:#c8941e;text-decoration:none;">Terms</a> ·
              <a href="${APP_URL}/contact" style="color:#c8941e;text-decoration:none;">Contact</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const link = `${APP_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Verify your Giftora account',
    html: baseTemplate(`
      <h2 style="color:#0d1117;font-size:24px;margin:0 0 16px;font-family:Georgia,serif;">Welcome to Giftora${name ? `, ${name}` : ''}!</h2>
      <p style="color:#4b5563;line-height:1.7;margin:0 0 24px;">Thank you for creating your account. Please verify your email address to get started.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${link}" style="background:#c8941e;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">Verify Email Address</a>
      </div>
      <p style="color:#9ca3af;font-size:13px;margin:0;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
    `),
  });
}

export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const link = `${APP_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Reset your Giftora password',
    html: baseTemplate(`
      <h2 style="color:#0d1117;font-size:24px;margin:0 0 16px;font-family:Georgia,serif;">Reset Your Password</h2>
      <p style="color:#4b5563;line-height:1.7;margin:0 0 24px;">Hello${name ? ` ${name}` : ''}, we received a request to reset your password. Click the button below to set a new password.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${link}" style="background:#c8941e;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">Reset Password</a>
      </div>
      <p style="color:#9ca3af;font-size:13px;margin:0;">This link expires in 1 hour. If you didn't request this, please ignore this email — your password won't change.</p>
    `),
  });
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  items: { name: string; quantity: number; price: number }[],
  total: number,
  name?: string
) {
  const itemRows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f4ede2;color:#374151;">${i.name}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f4ede2;color:#374151;text-align:center;">×${i.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f4ede2;color:#374151;text-align:right;">€${(i.price * i.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Order confirmed — #${orderNumber}`,
    html: baseTemplate(`
      <h2 style="color:#0d1117;font-size:24px;margin:0 0 8px;font-family:Georgia,serif;">Order Confirmed!</h2>
      <p style="color:#c8941e;font-size:15px;margin:0 0 24px;">Order #${orderNumber}</p>
      <p style="color:#4b5563;line-height:1.7;margin:0 0 24px;">Hello${name ? ` ${name}` : ''}, thank you for your order! We're preparing your gift box with love and care.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 0;border-bottom:2px solid #e5dfcc;color:#6b5b3e;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Item</th>
            <th style="text-align:center;padding:8px 0;border-bottom:2px solid #e5dfcc;color:#6b5b3e;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Qty</th>
            <th style="text-align:right;padding:8px 0;border-bottom:2px solid #e5dfcc;color:#6b5b3e;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:16px 0 0;font-weight:700;color:#0d1117;">Total</td>
            <td style="padding:16px 0 0;font-weight:700;color:#c8941e;text-align:right;font-size:18px;">€${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <div style="text-align:center;margin:24px 0;">
        <a href="${APP_URL}/account/orders" style="background:#0d1117;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">View Order</a>
      </div>
    `),
  });
}

export async function sendShippingNotificationEmail(
  email: string,
  orderNumber: string,
  trackingNumber: string,
  trackingUrl: string,
  name?: string
) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Your Giftora order is on its way! — #${orderNumber}`,
    html: baseTemplate(`
      <h2 style="color:#0d1117;font-size:24px;margin:0 0 8px;font-family:Georgia,serif;">Your Order Is Shipped!</h2>
      <p style="color:#c8941e;font-size:15px;margin:0 0 24px;">Order #${orderNumber}</p>
      <p style="color:#4b5563;line-height:1.7;margin:0 0 16px;">Hello${name ? ` ${name}` : ''}! Great news — your gift box is on its way.</p>
      <div style="background:#faf7f2;border:1px solid #e5dfcc;border-radius:8px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;color:#6b5b3e;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Tracking Number</p>
        <p style="margin:0;color:#0d1117;font-size:18px;font-weight:700;">${trackingNumber}</p>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="${trackingUrl}" style="background:#c8941e;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">Track Your Package</a>
      </div>
    `),
  });
}

export async function sendNewsletterWelcome(email: string) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Welcome to the Giftora family!',
    html: baseTemplate(`
      <h2 style="color:#0d1117;font-size:24px;margin:0 0 16px;font-family:Georgia,serif;">You're In!</h2>
      <p style="color:#4b5563;line-height:1.7;margin:0 0 24px;">Welcome to the Giftora newsletter! You'll be the first to hear about new collections, exclusive offers, and gifting inspiration.</p>
      <p style="color:#4b5563;line-height:1.7;margin:0 0 24px;">As a welcome gift, enjoy <strong style="color:#c8941e;">10% off</strong> your first order with code:</p>
      <div style="background:#0d1117;color:#c8941e;text-align:center;padding:20px;border-radius:8px;font-size:24px;font-weight:700;letter-spacing:4px;margin-bottom:24px;">WELCOME10</div>
      <div style="text-align:center;">
        <a href="${APP_URL}/products" style="background:#c8941e;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">Shop Now</a>
      </div>
    `),
  });
}

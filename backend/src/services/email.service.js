import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: env.GOOGLE_EMAIL_ID,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    refreshToken: env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Recoz Feedback" <${env.GOOGLE_EMAIL_ID}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent successfully to ${to} (MessageId: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * Beautiful HTML email template for Account Verification
 */
export const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
  const subject = "Verify your Recoz Feedback account";
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F5EE; margin: 0; padding: 0; color: #1E1A17; }
    .wrapper { width: 100%; max-width: 580px; margin: 30px auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #EFE4D6; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    .header { background: #121110; padding: 32px 36px; text-align: center; }
    .logo-badge { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: #F62440; border-radius: 10px; color: #FFFFFF; font-weight: 800; font-size: 22px; margin-bottom: 12px; }
    .brand-title { color: #FFFFFF; font-size: 16px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin: 0; }
    .brand-subtitle { color: #D1C5B0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
    .content { padding: 40px 36px; }
    .greeting { font-size: 20px; font-weight: 700; color: #121110; margin: 0 0 16px; }
    .text { font-size: 15px; line-height: 1.6; color: #524B45; margin: 0 0 24px; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #F62440; color: #FFFFFF !important; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 34px; border-radius: 10px; box-shadow: 0 4px 14px rgba(246, 36, 64, 0.3); transition: background-color 0.2s; }
    .link-fallback { font-size: 12px; line-height: 1.5; color: #8F877D; background: #FAF7F2; border-radius: 8px; padding: 12px; word-break: break-all; margin-top: 24px; }
    .footer { padding: 24px 36px; background-color: #FAF7F2; border-top: 1px solid #EFE4D6; text-align: center; font-size: 12px; color: #8F877D; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-badge">R</div>
      <h1 class="brand-title">RECOZ FEEDBACK</h1>
      <div class="brand-subtitle">Customer Intelligence Platform</div>
    </div>
    <div class="content">
      <h2 class="greeting">Welcome to Recoz, ${name || 'there'}! 👋</h2>
      <p class="text">
        Thank you for creating your workspace. To activate your account and start collecting intelligent customer feedback, please confirm your email address.
      </p>
      <div class="btn-container">
        <a href="${verificationUrl}" class="btn" target="_blank">Verify Email Address</a>
      </div>
      <p class="text" style="font-size: 13px; color: #736B63;">
        This verification link will expire in <strong>24 hours</strong>. If you did not create this account, you can safely ignore this email.
      </p>
      <div class="link-fallback">
        If the button above doesn't work, copy and paste this URL into your browser:<br>
        <a href="${verificationUrl}" style="color: #F62440; text-decoration: underline;">${verificationUrl}</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Recoz Feedback. All rights reserved.</p>
      <p>Protected by 256-bit TLS encryption.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendMail({
    to,
    subject,
    text: `Welcome to Recoz Feedback! Please verify your account by visiting: ${verificationUrl}`,
    html,
  });
};

/**
 * Beautiful HTML email template for Forgot Password OTP
 */
export const sendOtpEmail = async ({ to, name, otp }) => {
  const subject = "Your Recoz Password Reset Code";
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F5EE; margin: 0; padding: 0; color: #1E1A17; }
    .wrapper { width: 100%; max-width: 580px; margin: 30px auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #EFE4D6; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    .header { background: #121110; padding: 32px 36px; text-align: center; }
    .logo-badge { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: #F62440; border-radius: 10px; color: #FFFFFF; font-weight: 800; font-size: 22px; margin-bottom: 12px; }
    .brand-title { color: #FFFFFF; font-size: 16px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin: 0; }
    .brand-subtitle { color: #D1C5B0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
    .content { padding: 40px 36px; }
    .greeting { font-size: 20px; font-weight: 700; color: #121110; margin: 0 0 16px; }
    .text { font-size: 15px; line-height: 1.6; color: #524B45; margin: 0 0 24px; }
    .otp-card { background: #121110; border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 0.3em; color: #FFFFFF; text-shadow: 0 2px 10px rgba(246, 36, 64, 0.4); margin: 0; }
    .otp-label { color: #D1C5B0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 8px; }
    .warning { font-size: 13px; color: #8F877D; background: #FAF7F2; border-left: 3px solid #F62440; padding: 12px 16px; border-radius: 4px; margin: 24px 0 0; }
    .footer { padding: 24px 36px; background-color: #FAF7F2; border-top: 1px solid #EFE4D6; text-align: center; font-size: 12px; color: #8F877D; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-badge">R</div>
      <h1 class="brand-title">RECOZ FEEDBACK</h1>
      <div class="brand-subtitle">Security & Authentication</div>
    </div>
    <div class="content">
      <h2 class="greeting">Reset your password</h2>
      <p class="text">
        Hello ${name || 'there'}, we received a request to reset the password for your Recoz Feedback account. Use the one-time code below to proceed:
      </p>
      <div class="otp-card">
        <div class="otp-code">${otp}</div>
        <div class="otp-label">6-Digit Verification Code</div>
      </div>
      <div class="warning">
        ⏳ This code will expire in <strong>10 minutes</strong>.<br>
        🔒 If you did not request a password reset, please ignore this email or reach out if you have concerns.
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Recoz Feedback. All rights reserved.</p>
      <p>Secure one-time authentication code.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendMail({
    to,
    subject,
    text: `Your Recoz Feedback password reset OTP is: ${otp}. It expires in 10 minutes.`,
    html,
  });
};

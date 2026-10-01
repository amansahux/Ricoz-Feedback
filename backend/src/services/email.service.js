import { env } from "../config/env.js";

const sendMail = async ({ email, subject, html, text }) => {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: env.BREVO_FROM_NAME,
        email: env.BREVO_FROM_EMAIL,
      },
      to: [{ email, name: "User" }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Brevo error:", data);
    throw new Error(data.message || "Failed to send email");
  }

  return data; // { messageId: "..." }
};


/**
 * Beautiful HTML email template for Account Verification
 */
export const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
  const subject = "Verify your Recoz account";
  const year = new Date().getFullYear();
  const displayName = name && name.trim() ? name.trim() : "there";

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${subject}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #0c0d11; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .email-container { width: 100%; max-width: 580px; margin: 0 auto; }
    .btn-action:hover { background-color: #ff3352 !important; box-shadow: 0 10px 24px rgba(246, 36, 64, 0.45) !important; }
    @media screen and (max-width: 600px) {
      .inner-padding { padding: 32px 24px !important; }
      .header-padding { padding: 36px 20px 28px 20px !important; }
      .mobile-text-center { text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d11; -webkit-font-smoothing: antialiased;">
  <!-- PREHEADER TRICK -->
  <div style="display: none; font-size: 1px; color: #0c0d11; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Activate your Recoz workspace and unlock customer intelligence in seconds.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0c0d11; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px 50px 16px;">
        <!-- MAIN CARD -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background: #14161d; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05);">
          
          <!-- TOP GLOW ACCENT BAR -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #F62440 0%, #FF6584 50%, #F62440 100%); font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td align="center" class="header-padding" style="padding: 42px 40px 32px 40px; background: radial-gradient(circle at 50% 0%, rgba(246, 36, 64, 0.15) 0%, rgba(20, 22, 29, 0) 75%);">
              <!-- LOGO BADGE -->
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" width="52" height="52" style="width: 52px; height: 52px; background: linear-gradient(135deg, #F62440 0%, #D81B34 100%); border-radius: 14px; box-shadow: 0 8px 24px rgba(246, 36, 64, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.35); text-align: center;">
                          <span style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 26px; font-weight: 800; color: #FFFFFF; line-height: 52px; display: inline-block;">R</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 14px;">
                    <div style="font-size: 18px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #FFFFFF; margin: 0;">
                      RECOZ
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 4px;">
                    <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #8F96A3;">
                      CUSTOMER INTELLIGENCE SUITE
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SEPARATOR -->
          <tr>
            <td style="padding: 0 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td class="inner-padding" style="padding: 38px 40px 32px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 14px 0; font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.01em;">
                      Welcome aboard, ${displayName}! ✨
                    </h2>
                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #A4ACB9;">
                      Thank you for choosing Recoz. You're just one step away from transforming how your business collects feedback, analyzes sentiment, and delights customers.
                    </p>
                    <p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.65; color: #A4ACB9;">
                      Please click the button below to confirm your email and activate your workspace.
                    </p>
                  </td>
                </tr>

                <!-- CTA BUTTON -->
                <tr>
                  <td align="center" style="padding: 8px 0 36px 0;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #F62440 0%, #E01B36 100%); box-shadow: 0 8px 20px rgba(246, 36, 64, 0.35);">
                          <a href="${verificationUrl}" target="_blank" class="btn-action" style="display: inline-block; padding: 16px 38px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 15px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px; letter-spacing: 0.02em;">
                            Verify Email Address &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- TIMEOUT & SECURITY BADGE -->
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 16px 18px;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 12px; font-size: 16px; line-height: 1.4;">⏱️</td>
                        <td style="font-size: 13px; line-height: 1.55; color: #8F96A3;">
                          This link will remain active for <strong style="color: #FFFFFF;">24 hours</strong>. If you did not create an account with Recoz, no further action is required.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- FALLBACK URL BOX -->
                <tr>
                  <td style="padding-top: 24px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #717886; text-transform: uppercase; letter-spacing: 0.05em;">
                      Trouble with the button? Copy and paste this link:
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #0D0E13; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px;">
                      <tr>
                        <td style="padding: 12px 14px; word-break: break-all; font-family: 'Courier New', Courier, monospace; font-size: 12px; line-height: 1.5; color: #F62440;">
                          <a href="${verificationUrl}" target="_blank" style="color: #F62440; text-decoration: underline;">${verificationUrl}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 28px 40px; background-color: #0e1017; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 12px; line-height: 1.6; color: #616977;">
                    <p style="margin: 0 0 6px 0;">&copy; ${year} Recoz Feedback Inc. All rights reserved.</p>
                    <p style="margin: 0; font-size: 11px; color: #4B5260;">Enterprise-Grade Security &bull; 256-Bit TLS Encryption</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendMail({
    email: to,
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
  const year = new Date().getFullYear();
  const displayName = name && name.trim() ? name.trim() : "there";

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${subject}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@700;800&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #0c0d11; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .email-container { width: 100%; max-width: 580px; margin: 0 auto; }
    @media screen and (max-width: 600px) {
      .inner-padding { padding: 32px 24px !important; }
      .header-padding { padding: 36px 20px 28px 20px !important; }
      .otp-code-text { font-size: 34px !important; letter-spacing: 0.25em !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d11; -webkit-font-smoothing: antialiased;">
  <!-- PREHEADER TRICK -->
  <div style="display: none; font-size: 1px; color: #0c0d11; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Use verification code ${otp} to reset your Recoz account password.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0c0d11; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px 50px 16px;">
        <!-- MAIN CARD -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background: #14161d; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05);">
          
          <!-- TOP GLOW ACCENT BAR -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #F62440 0%, #FF6584 50%, #F62440 100%); font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td align="center" class="header-padding" style="padding: 42px 40px 32px 40px; background: radial-gradient(circle at 50% 0%, rgba(246, 36, 64, 0.15) 0%, rgba(20, 22, 29, 0) 75%);">
              <!-- LOGO BADGE -->
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" width="52" height="52" style="width: 52px; height: 52px; background: linear-gradient(135deg, #F62440 0%, #D81B34 100%); border-radius: 14px; box-shadow: 0 8px 24px rgba(246, 36, 64, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.35); text-align: center;">
                          <span style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 26px; font-weight: 800; color: #FFFFFF; line-height: 52px; display: inline-block;">R</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 14px;">
                    <div style="font-size: 18px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #FFFFFF; margin: 0;">
                      RECOZ
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 4px;">
                    <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #8F96A3;">
                      SECURITY &amp; AUTHENTICATION
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SEPARATOR -->
          <tr>
            <td style="padding: 0 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td class="inner-padding" style="padding: 38px 40px 34px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 14px 0; font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.01em;">
                      Reset your password 🔐
                    </h2>
                    <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.65; color: #A4ACB9;">
                      Hello <strong style="color: #FFFFFF;">${displayName}</strong>, we received a request to reset the password for your Recoz account. Enter the one-time verification code below:
                    </p>
                  </td>
                </tr>

                <!-- LUXURY OTP DISPLAY CARD -->
                <tr>
                  <td align="center" style="padding: 4px 0 28px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #0D0E13; border: 1px solid rgba(246, 36, 64, 0.3); border-radius: 16px; box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 24px rgba(246, 36, 64, 0.1);">
                      <tr>
                        <td align="center" style="padding: 26px 20px;">
                          <div class="otp-code-text" style="font-family: 'JetBrains Mono', 'Courier New', Courier, monospace; font-size: 42px; font-weight: 800; letter-spacing: 0.32em; color: #FFFFFF; text-shadow: 0 0 20px rgba(246, 36, 64, 0.6); padding-left: 0.32em; margin: 0;">
                            ${otp}
                          </div>
                          <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8F96A3; margin-top: 10px;">
                            One-Time Verification Code
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- SECURITY WARNING / EXPIRY BOX -->
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(246, 36, 64, 0.05); border: 1px solid rgba(246, 36, 64, 0.2); border-radius: 12px; padding: 18px 20px;">
                      <tr>
                        <td width="24" valign="top" style="padding-right: 12px; font-size: 16px; line-height: 1.4;">⏳</td>
                        <td style="font-size: 13px; line-height: 1.55; color: #C5CBD6;">
                          This code will strictly expire in <strong style="color: #FFFFFF;">10 minutes</strong>.
                        </td>
                      </tr>
                      <tr>
                        <td width="24" valign="top" style="padding-right: 12px; padding-top: 8px; font-size: 16px; line-height: 1.4;">🛡️</td>
                        <td style="padding-top: 8px; font-size: 13px; line-height: 1.55; color: #8F96A3;">
                          If you did not request this password reset, your account is still secure. You can safely ignore this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 28px 40px; background-color: #0e1017; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 12px; line-height: 1.6; color: #616977;">
                    <p style="margin: 0 0 6px 0;">&copy; ${year} Recoz Feedback Inc. All rights reserved.</p>
                    <p style="margin: 0; font-size: 11px; color: #4B5260;">Enterprise-Grade Security &bull; 256-Bit TLS Encryption</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendMail({
    email: to,
    subject,
    text: `Your Recoz Feedback password reset OTP is: ${otp}. It expires in 10 minutes.`,
    html,
  });
};

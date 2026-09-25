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

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: env.GOOGLE_EMAIL_ID,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

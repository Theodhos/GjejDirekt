import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendMail({
  to,
  subject,
  html
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";
  return mailer.sendMail({ from, to, subject, html });
}

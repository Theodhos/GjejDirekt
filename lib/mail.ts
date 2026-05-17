import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function sendReportEmail({
  listingTitle,
  listingId,
  reporterName,
  reason
}: {
  listingTitle: string;
  listingId: string;
  reporterName: string;
  reason: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@tourismmarketplace.com";
  const appUrl = getAppUrl();
  const deleteToken = process.env.ADMIN_DELETE_SECRET || "super-secret-token";
  const deleteUrl = `${appUrl}/api/admin/listings/delete-via-email?id=${listingId}&token=${deleteToken}`;
  const dashboardUrl = `${appUrl}/admin#reports-section`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
      <h2 style="color: #ef4444; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">New Listing Report</h2>
      <p style="color: #64748b; font-size: 16px;">A user has reported a listing on the platform.</p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Listing:</strong> ${listingTitle}</p>
        <p style="margin: 0 0 10px 0;"><strong>Reporter:</strong> ${reporterName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Reason:</strong></p>
        <blockquote style="margin: 0; padding: 10px 20px; border-left: 4px solid #ef4444; background: #fff; font-style: italic; color: #475569;">"${reason}"</blockquote>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 30px;">
        <a href="${deleteUrl}" style="background-color: #ef4444; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px;">DELETE LISTING NOW</a>
        <a href="${dashboardUrl}" style="background-color: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; margin-left: 10px;">VIEW ON DASHBOARD</a>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmail,
    subject: `Report: ${listingTitle}`,
    html
  });
}

export async function sendListingSubmissionEmail({
  listingTitle,
  listingId,
  ownerName,
  category,
  location
}: {
  listingTitle: string;
  listingId: string;
  ownerName: string;
  category: string;
  location: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@tourismmarketplace.com";
  const appUrl = getAppUrl();
  const token = process.env.ADMIN_DELETE_SECRET || "super-secret-token";

  const approveUrl = `${appUrl}/api/admin/listings/status-via-email?id=${listingId}&status=approved&token=${token}`;
  const rejectUrl = `${appUrl}/api/admin/listings/status-via-email?id=${listingId}&status=rejected&token=${token}`;
  const dashboardUrl = `${appUrl}/admin`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
      <h2 style="color: #0f172a; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">New Listing Submission</h2>
      <p style="color: #64748b; font-size: 16px;">A new service has been submitted for approval.</p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Title:</strong> ${listingTitle}</p>
        <p style="margin: 0 0 10px 0;"><strong>Owner:</strong> ${ownerName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Category:</strong> ${category}</p>
        <p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${location}</p>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 30px;">
        <a href="${approveUrl}" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px;">APPROVE</a>
        <a href="${rejectUrl}" style="background-color: #ef4444; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; margin-left: 10px;">REJECT</a>
        <a href="${dashboardUrl}" style="background-color: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; margin-left: 10px;">DASHBOARD</a>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmail,
    subject: `New Listing: ${listingTitle}`,
    html
  });
}

export async function sendUserRegistrationEmail({
  userName,
  userEmail,
  userPhone
}: {
  userName: string;
  userEmail: string;
  userPhone: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@tourismmarketplace.com";
  const appUrl = getAppUrl();
  const dashboardUrl = `${appUrl}/admin/users`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
      <h2 style="color: #0f172a; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">New User Registration</h2>
      <p style="color: #64748b; font-size: 16px;">A new user just registered on the platform.</p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${userName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${userEmail}</p>
        <p style="margin: 0;"><strong>Phone:</strong> ${userPhone}</p>
      </div>
      <div style="margin-top: 30px;">
        <a href="${dashboardUrl}" style="background-color: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px;">VIEW USERS</a>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmail,
    subject: `New user registered: ${userName}`,
    html
  });
}

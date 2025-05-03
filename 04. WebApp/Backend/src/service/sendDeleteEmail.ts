import nodemailer from "nodemailer";
import env from "../util/validateEnv";

const transporter = nodemailer.createTransport({
  service: env.EMAIL_SERVICE,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

const sendDeleteEmail = async (to: string) => {
  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject: "Account Deletion Notice – skyT",
    html: `
    <div
      style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f8fb;
        padding: 40px;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      "
    >
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px">
        <h2 style="color: #c0392b; margin-bottom: 10px">
          Account Deleted - <span style="color: #1e90ff">skyT</span>
        </h2>

        <p style="font-size: 16px; line-height: 1.6">
          This is to inform you that your account associated with this email address has been deleted by an administrator.
        </p>

        <p style="font-size: 15px; color: #555; margin: 20px 0;">
          If you believe this action was taken in error or you have any questions, please contact your estate administrator or our support team.
        </p>

        <p style="font-size: 14px; color: #888;">
          Note: You will no longer be able to log in or access any services linked to your account.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee" />

        <p style="font-size: 14px; color: #555">
          Best regards,<br />
          <strong style="color: #1e90ff">skyT DevOps Team</strong>
        </p>
      </div>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendDeleteEmail;

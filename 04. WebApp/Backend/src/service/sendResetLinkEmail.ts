import nodemailer from "nodemailer";
import env from "../util/validateEnv";

const sendResetLinkEmail = async (email: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    service: env.EMAIL_SERVICE,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
    <div
      style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        padding: 40px;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      "
    >
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px">
        <h2 style="color: #2c3e50; margin-bottom: 16px">
          🔐 Password Reset Request
        </h2>

        <p style="line-height: 1.6">
          We received a request to reset your password. Click the button below to
          proceed:
        </p>

        <div style="text-align: center; margin: 30px 0">
          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              font-weight: 600;
              border-radius: 5px;
              font-size: 16px;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="line-height: 1.6">
          If you did not request a password reset, you can safely ignore this email.
          Your account remains secure.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee" />

        <p style="font-size: 14px; color: #555">
          Best regards,<br /><strong style="color: #007bff"
            >skyT DevOps Team</strong
          >
        </p>
      </div>
    </div>

    `,
  };
  await transporter.sendMail(mailOptions);
};

export default sendResetLinkEmail;

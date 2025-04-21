import nodemailer from "nodemailer";
import env from "../util/validateEnv";

const transporter = nodemailer.createTransport({
  service: env.EMAIL_SERVICE,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject: "Email Verification Code – skyT",
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
          <h2 style="color: #2c3e50; margin-bottom: 10px">
            Verify your email for <span style="color: #1e90ff">skyT</span>
          </h2>
  
          <p style="font-size: 16px; line-height: 1.6">
            You're almost there! Use the following verification code to confirm your new email address:
          </p>
  
          <div style="margin: 20px 0">
            <p
              style="
                font-size: 1.5rem;
                font-weight: bold;
                background: #eef3f7;
                padding: 12px 20px;
                border-radius: 6px;
                display: inline-block;
                letter-spacing: 3px;
                color: #000;
              "
            >
              ${otp}
            </p>
          </div>
  
          <p style="font-size: 15px; color: #555">
            This code will expire shortly. If you didn’t request this, you can ignore this email.
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

export default sendOTPEmail;

import nodemailer from "nodemailer";
import env from "../util/validateEnv";

const transporter = nodemailer.createTransport({
  service: env.EMAIL_SERVICE,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

const sendPasswordEmail = async (to: string, password: string) => {
  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject: "Your Account Credentials",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to <span style="color:#1E90FF;">skyT</span>!</h2>
        <p>We're excited to have you on board.</p>
        <p><strong>Your temporary password:</strong></p>
        <p style="font-size: 1.25rem; font-weight: bold; background: #f2f2f2; padding: 10px; border-radius: 4px; display: inline-block;">
          ${password}
        </p>
        <p>Please change this password after logging in for security purposes.</p>
        <br />
        <p>Regards,<br><em>skyT DevOps Team</em></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendPasswordEmail;

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
          Welcome to <span style="color: #1e90ff">skyT</span>!
        </h2>

        <p style="font-size: 16px; line-height: 1.6">
          We're thrilled to have you on board. Here's your temporary password:
        </p>

        <div style="margin: 20px 0">
          <p
            style="
              font-size: 1.25rem;
              font-weight: bold;
              background: #eef3f7;
              padding: 12px 20px;
              border-radius: 6px;
              display: inline-block;
              letter-spacing: 1px;
              color: #000;
            "
          >
            ${password}
          </p>
        </div>

        <p style="font-size: 15px; color: #555">
          Please make sure to change this password after your first login to keep
          your account secure.
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

export default sendPasswordEmail;

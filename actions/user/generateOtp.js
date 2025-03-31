import nodemailer from "nodemailer";
const generateOtpMail = (email, otp) => {
    return {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your HelperBuddy OTP Code",
      text: `Hello!\n\nYour OTP for HelperBuddy is: ${otp}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #007bff;"> Your HelperBuddy OTP</h2>
            <p>Hello!</p>
            <p>Your OTP for accessing HelperBuddy is:</p>
            <h1 style="letter-spacing: 5px; color: #333;">${otp}</h1>
            <p style="color: #888;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
            <p>If you didn’t request this, you can safely ignore this email.</p>
            <br>
            <p>Best regards,<br><strong>HelperBuddy Team</strong></p>
          </div>
        </div>
      `,
    };
  };

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = generateOtpMail(email, otp);
  await transporter.sendMail(mailOptions);
};

export default sendOtpEmail;


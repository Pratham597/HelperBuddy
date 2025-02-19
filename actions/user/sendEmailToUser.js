import nodemailer from "nodemailer"

const sendEmailToUser = async (userEmail, userName, serviceOrder, partner) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const date = serviceOrder.timeline.split(" ")[0]

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `📢 Service Order Confirmation - Order #${serviceOrder._id}`,
    text: `Dear ${userName},
  
  Your service request has been assigned to a professional partner. 
  
  🛠 Service Order ID: ${serviceOrder._id}
  📅 Booking Date: ${date}
  ✔️ Your service is now being processed.
  
  We will notify you once the partner reaches out to you.
  
  Thank you for choosing us!  
  
  Best regards,  
  Helper Buddy Support Team`,
    html: `
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Your service request has been successfully assigned to a professional partner.</p>
          <h3>Order Details:</h3>
          <ul>
            <li><strong>🛠 Service Name:</strong> ${serviceOrder.service.name}</li>
            <li><strong>📅 Booking Date:</strong> ${date}</li>
            <li><strong>✔️ Status:</strong> Assigned & Processing</li>
            <li><strong>🧑‍💻 Service OTP: ${serviceOrder.userCode}</strong></li>
          </ul>
          <p>We will notify you once the partner reaches out to you.</p>
          <h3>Partner Details:</h3>
          <p> Partner Name: ${partner.name}</p>
          <p> Partner Phone: ${partner.phone} </p>
          <br/>
          <p>Thank you for choosing us!</p>
          <p><strong>HelperBuddy Support Team</strong></p>
        `,
  };

  let info = await transporter.sendMail(mailOptions);
};
export default sendEmailToUser  
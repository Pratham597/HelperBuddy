import nodemailer from "nodemailer";

async function sendEmailToPartner(emails, userDetails, service) {
  if (!emails.length) return;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails.join(","),
    subject: `🔔 New Service Request from ${userDetails.name} - ${service.name}`,
    text: `Hello,
  
  You have received a new service request.
  
  🔹 Service: ${service.name}  
  👤 Customer Name: ${userDetails.name}  
  📞 Contact Number: ${userDetails.phone}  
  📍 Address: ${userDetails.address}  
  📌 Pincode: ${userDetails.pincode}  
  ⏳ Timeline: ${userDetails.timeline}  
  
  Please review the request and respond at your earliest convenience.
  
  Best regards,  
  Helper Buddy Support Team`,
    html: `
      <p>Hello,</p>
      <p>You have received a new service request.</p>
      <h3>Request Details:</h3>
      <ul>
        <li><strong>🔹 Service:</strong> ${service.name}</li>
        <li><strong>👤 Customer Name:</strong> ${userDetails.name}</li>
        <li><strong>📞 Contact Number:</strong> ${userDetails.phone}</li>
        <li><strong>📍 Address:</strong> ${userDetails.address}</li>
        <li><strong>📌 Pincode:</strong> ${userDetails.pincode}</li>
        <li><strong>⏳ Timeline:</strong> ${userDetails.timeline}</li>
      </ul>
      <p> Click here to go dashboard: ${process.env.NEXT_PUBLIC_URL}/partner/dashboard/services/orderRequests
      <p>Please review the request and respond at your earliest convenience.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>Helper Buddy Support Team</strong></p>
    `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}
export default sendEmailToPartner;

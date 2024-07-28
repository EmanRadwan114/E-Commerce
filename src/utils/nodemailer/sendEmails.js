import nodemailer from "nodemailer";

export default async function sendEmails(to, subject, link) {
  const transporter = nodemailer.createTransport({
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    service: "gmail",
    auth: {
      user: "emanalaa11499@gmail.com",
      pass: process.env.APP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"Eman Radwan ✨" <emanalaa11499@gmail.com>',
    to: to ? to : "emanalaa11499@gmail.com",
    subject: subject ? subject : "Email Verification ✔",
    html: `<h1 style="font-weight:900; font-size:30px; color:blue; margin-bottom:20px">Verify Your Email</h1>
             <a href=${link} style="padding:7px 12px; background-color:white; 
             border:1px solid blue; color:blue; font-size:20px; font-weight:600">
             Click here to verify
             </a>`,
  });
}

import nodemailer from "nodemailer";

export default async function sendEmails(to, subject, link) {
  const transporter = nodemailer.createTransport({
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.APP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"Eman Radwan ✨" <emanalaa11499@gmail.com>',
    to: to ? to : process.env.SENDER_EMAIL,
    subject: subject ? subject : "Email Verification ✔",
    html: `<div style="width:80%; margin:0 auto; text-align:center; padding:20px; border:1px solid blue; border-radius:10px; background-color:whitesmoke">
             <h1 style="font-weight:900; font-size:30px; color:blue; margin-bottom:20px">Verify Your Email</h1>
             ${link}
           </div>
          `,
  });
}

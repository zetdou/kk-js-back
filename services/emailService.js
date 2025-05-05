const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  auth: {
    user: process.env.BREVO_API_KEY,
    pass: process.env.BREVO_API_PASS,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `http://127.0.0.1:3000/users/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.BREVO_EMAIL,
    to: email,
    subject: "Witaj w komitecie! Potwierdź swój adres w naszym sklepie!",
    html: `Kliknij <a href="${verificationUrl}">tutaj</a> aby zweryfikować swój adres email w naszym sklepie! Życzymy udanych zakupów!`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to: ", email);
  } catch (err) {
    console.error("Error sending email: ", err);
    throw err;
  }
};

module.exports = { sendVerificationEmail };

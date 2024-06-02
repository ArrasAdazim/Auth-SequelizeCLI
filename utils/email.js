const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOtp = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP Succesfully",
    text: `Your OTP code is ${otp}.Please use OTP before 10 minutes`,
  };

  return transporter.sendMail(mailOptions);
};

// const sendOtpForgetPassoword = (email, otp) => {
//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: "ForgetPassoword Succesfully",
//     text: `Your OTP code is ${otp}.Please verify account 10 minutes after ForgetPassoword`,
//   };

//   return transporter.sendMail(mailOptions);
// };

// module.exports = { sendOtpRegister, sendOtpForgetPassoword };
module.exports = sendOtp;

const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/otp");
const sendOtp = require("../utils/email");
const { registerSchema } = require("../utils/validateSchema");

const register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const { error } = registerSchema.validate({
    email,
    password,
    confirmPassword,
  });
  if (error) {
    return res.status(400).json({
      status: "BAD REQUEST",
      message: error.details[0].message,
      data: null,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const checkIdUser = await User.findOne({ where: { email } });
    if (checkIdUser) {
      return res.status(400).json({
        status: "BAD REQUEST",
        message: "Email is already registered",
        data: null,
      });
    }

    const user = await User.create({ email, password: hashedPassword });
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();
    await sendOtp(email, otp);

    res.status(201).json({
      status: "CREATED",
      message: "User registered. Check your email for OTP.",
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "BAD REQUEST", message: error.message, data: null });
  }
};

const verifyRegister = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ where: { email, otp } });

  if (!user || user.otpExpiresAt < new Date()) {
    return res.status(400).json({
      status: "BAD REQUEST",
      message: "Invalid or expired OTP",
      data: null,
    });
  }

  user.otp = null;
  user.otpExpiresAt = null;
  user.isVerified = true;
  await user.save();

  res.status(200).json({
    status: "OK",
    message: "OTP verified. You can now login.",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  try {
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        status: "BAD REQUEST",
        message: "Invalid email or password",
        data: null,
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        status: "FORBIDDEN",
        message: "Account not verified. Please verify your account first.",
        data: null,
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const response = {
      status: "OK",
      message: "Login Succesfully",
      data: {
        email: email,
        token: token,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const response = {
      status: "Failed",
      message: "Login Failed",
      error: error.message,
    };
    res.status(400).json(response);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res
      .status(400)
      .json({ status: "BAD REQUEST", message: "Invalid email", data: null });
  }

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();
  await sendOtp(email, otp);

  res.status(200).json({
    status: "OK",
    message: "Check your email for OTP to reset password",
    data: null,
  });
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ where: { email, otp } });

  if (!user || user.otpExpiresAt < new Date()) {
    return res.status(400).json({
      status: "BAD REQUEST",
      message: "Invalid or expired OTP",
      data: null,
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  res
    .status(200)
    .json({ status: "OK", message: "Password reset successfully" });
};

const resendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res
      .status(400)
      .json({ status: "BAD REQUEST", message: "Invalid email", data: null });
  }

  if (user.isVerified) {
    return res.status(400).json({
      status: "BAD REQUEST",
      message: "Account already verified",
      data: null,
    });
  }

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();
  await sendOtp(email, otp);

  res.status(200).json({ status: "OK", message: "Check your email for OTP" });
};

module.exports = {
  register,
  verifyRegister,
  login,
  forgetPassword,
  resetPassword,
  resendOtp,
};

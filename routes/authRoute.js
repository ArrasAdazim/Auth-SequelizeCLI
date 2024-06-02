const express = require("express");
const router = express.Router();
const {
  register,
  verifyRegister,
  login,
  forgetPassword,
  resetPassword,
  resendOtp,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/verify-register", verifyRegister);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

module.exports = router;

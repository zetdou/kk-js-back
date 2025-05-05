const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  resendVerificationEmailHandler,
} = requrie("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current", getCurrentUser);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", resendVerificationEmailHandler);

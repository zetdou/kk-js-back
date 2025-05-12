const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  resendVerificationEmailHandler,
  firebaseAuthLogin,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, getCurrentUser);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", resendVerificationEmailHandler);

router.post("/firebase-login", firebaseAuthLogin);

module.exports = router;

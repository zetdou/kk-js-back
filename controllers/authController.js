const {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
  resendVerificationEmail,
  firebaseLogin,
} = require("../services/authService");
const User = require("../schemas/UserSchema");

const firebaseAuthLogin = async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Missing firebase token!" });
  }
  try {
    const { token, user } = await firebaseLogin(idToken);
    return res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

const signup = async (req, res, next) => {
  const { username, password, email } = req.body;
  try {
    const newUser = await registerUser({
      username,
      password,
      email,
    });
    return res.status(201).json({
      message: "User created!",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const { token, user } = await loginUser({ username, password });
    return res.json({ token, user });
  } catch (err) {
    if (
      err.message === "Email has not been verified! Please check your inbox."
    ) {
      return res.status(401).json({ message: err.message });
    }
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await logoutUser(userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { username, email } = req.user;
    res.status(200).json({ username, email });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await verifyUser(verificationToken);
    if (!user) {
      const alreadyVerifiedUser = await User.findOne({
        verificationToken: null,
        verify: true,
        email: req.body.email,
      });

      if (alreadyVerifiedUser) {
        return res
          .status(400)
          .json({ message: "Email has been already verified!" });
      }
      return res.status(404).json({ message: "Users not found!" });
    }
    res.status(200).json({ message: "Verification succesful!" });
  } catch (err) {
    next(err);
  }
};

const resendVerificationEmailHandler = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing required field email!" });
  }
  try {
    const result = await resendVerificationEmail(email);
    if (result === "alreadyVerified") {
      return res
        .status(400)
        .json({ message: "Verification has already been passed!!" });
    }
    res.status(200).json({ message: "Verification email sent!" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  resendVerificationEmailHandler,
  firebaseAuthLogin,
};

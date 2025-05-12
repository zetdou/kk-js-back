const { nanoid } = require("nanoid");
const { sendVerificationEmail } = require("./emailService");
const admin = require("../config/firebaseAdmin");
const User = require("../schemas/UserSchema");
const jwt = require("jsonwebtoken");

const firebaseLogin = async (idToken) => {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const { email, uid } = decodedToken;

  let user = await User.findOne({ email });

  if (!user) {
    const username = email.split("@")[0];
    console.log(username);

    const user = new User({
      username,
      email,
      password: uid,
      verify: true,
      verificationToken: null,
    });

    await user.save();
  }

  const payload = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
  user.token = token;
  await user.save();

  return { token, user: { username: user.username, email: user.email } };
};

const registerUser = async ({ username, password, email }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("This email is already taken!");
  }

  const verificationToken = nanoid();

  const newUser = new User({
    username,
    password,
    email,
    verificationToken,
  });
  await newUser.setPassword(password);
  await newUser.save();

  await sendVerificationEmail(email, verificationToken);
  return newUser;
};

const loginUser = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not exists!");
  }

  if (!user.verify) {
    throw new Error("Email has not been verified! Please check your inbox.");
  }

  const isPasswordCorrect = await user.validatePassword(password);
  if (!isPasswordCorrect) {
    throw new Error("Wrong password!");
  }

  const payload = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
  user.token = token;
  await user.save();
  return { token, user: { username: user.username, email: user.email } };
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Not authorized!");
  }

  user.token = null;
  await user.save();
};

const verifyUser = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return null;
  }

  user.verify = true;
  user.verificationToken = null;
  await user.save();

  return user;
};

const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Uzytkownik nie znaleziony");
  }

  if (user.verify) {
    return "alreadyVerified";
  }

  await sendVerificationEmail(user.email, user.verificationToken);

  return "resent";
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
  resendVerificationEmail,
  firebaseLogin,
};

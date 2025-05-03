const { v4: uuid4 } = require("uuid");
const { sendVerificationEmail } = require("./emailService");
const User = require("../schemas/UserSchema");
const jwt = require("jsonwebtoken");

const registerUser = async ({ username, password, email }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("Ten email jest juz zarejestrowany!");
  }

  const verificationToken = uuid4();
  const newUser = new User({ username, password, email, verificationToken });
  await newUser.setPassword(password);
  await newUser.save();

  await sendVerificationEmail(email, verificationToken);
  return newUser;
};

const loginUser = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Uzytkownik o podanej nazwie nie istnieje!");
  }

  if (!user.verify) {
    throw new Error(
      "Adres email nie został jeszcze potwierdzony! Sprawdź swoją skrzynkę pocztową."
    );
  }

  const isPasswordCorrect = await user.validatePassword(password);
  if (!isPasswordCorrect) {
    throw new Error("Wprowadzono nieprawidłowe hasło!");
  }

  const payload = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "12h" });
  user.token = token;
  await user.save();
  return { token, user: { username: user.username, email: user.email } };
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Brak autoryzacji");
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
    return "Uzytkownik zweryfikowany";
  }

  await sendVerificationEmail(user.email, user.verificationToken);

  return "Wysłano ponownie";
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
  resendVerificationEmail,
};

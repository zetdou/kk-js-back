const passport = require("passport");
const User = require("../schemas/UserSchema");

const authMiddleware = (req, res, next) => {
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    async (err, user) => {
      if (!user || err) {
        return res.status(401).json({ message: "Unathorized!" });
      }
      const foundUser = await User.findById(user._id);
      const tokenFromHeader = req.headers.authorization?.split(" ")[1];

      if (!foundUser || foundUser.token !== tokenFromHeader) {
        return res.status(401).json({ message: "Unathorized!" });
      }
      req.user = foundUser;
      next();
    }
  )(req, res, next);
};

module.exports = { authMiddleware };

const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const User = require("../schemas/UserSchema");

const jwtStrategy = () => {
  const secret = process.env.JWT_SECRET;

  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  passport.use(
    new Strategy(params, async function (payload, done) {
      try {
        const user = await User.findOne({ _id: payload.id }).lean();

        if (!user) {
          return done(new Error("User!"));
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
};

module.exports = { jwtStrategy };

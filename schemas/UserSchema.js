const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

userSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema, "users");
module.exports = User;

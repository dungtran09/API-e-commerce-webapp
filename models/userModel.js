const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Provide your first name."],
      minlength: 4,
      maxlength: 35,
    },
    lastName: {
      type: String,
      required: [true, "Provide your last name."],
      minlength: 4,
      maxlength: 35,
    },
    email: {
      type: String,
      required: [true, "Provide your email."],
      unique: true,
      validate: [validator.isEmail, "Please provide valid email."],
    },
    address: [String],
    role: {
      type: String,
      default: "user",
    },
    wishList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    photo: String,
    role: {
      type: String,
      emun: ["Admin", "Creator", "User", "Guide"],
      default: "User",
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Provide your phone."],
    },
    password: {
      type: String,
      required: [true, "Provide your password."],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Provide your password confirm."],
      validate: {
        validator: function (pass) {
          return this.password === pass;
        },
        message: "Password confirm is not match.",
      },
    },
    cart: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
      },
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true },
);

// RUN WHEN USER CHANGED PASSWORD
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// HASH PASSWORD BEFORE SAVE DB
userSchema.pre("save", async function (next) {
  // Only run this fn is password has modified (not on other update fns)
  if (!this.isModified("password")) next();

  //Hash password with strength of 12
  const salt = bcrypt.genSaltSync(12);
  this.password = await bcrypt.hash(this.password, salt);

  // Remove field passwordConfirm
  this.passwordConfirm = undefined;
});

// COMPARE PASSWORD BEFORE LOGIN
userSchema.methods.isPasswordCorrect = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// CREATE PASSWORD RESET TOKEN
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  // console.log(resetToken);
  // console.log(this.passwordResetToken);
  return resetToken;
};

// CHECk LAST TIME PASSWORD CHANGED GREATER THAN TIME TOKEN CREATE OR NOT.
userSchema.methods.isChanged = function (JWTTimetamps) {
  if (this.updateAt) {
    const updatedTimestamp = parseInt(this.updateAt.getTime() / 1000, 10);
    // console.log("Time last changed password:" + updatedTimestamp);
    // console.log("Time of Token created     :" + JWTTimestamp);
    return JWTTimetamps < updatedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Remove any leading/trailing whitespaces
    minlength: 3, // Minimum length of 3 characters
    maxlength: 50 // Maximum length of 50 characters
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true, // Ensure the phone number is unique
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value); // Validate the phone number format (10 digits)
      },
      message: 'Phone number must be a valid 10-digit number'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Minimum length of 8 characters
    maxlength: 100, // Maximum length of 100 characters (you can adjust this as needed)
    select: false // Excludes the password field from query results (security measure)
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (value) {
        return value === this.password; // Validate that confirmPassword matches password
      },
      message: 'Confirm password does not match'
    }
  },
  passwordChangeAt: Date,
  passwordForgotToken: String,
  passwordExpireToken: Date,
});


userSchema.pre('save', async function(next) {
  // only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete the passwordconfirm
  this.passwordConfirm = undefined;
  next();
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
})

userSchema.pre(/^find/, async function(next) {
  this.find({ active: { $ne: false } })
})

// userSchema.methods.correctPassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password)
// }

userSchema.methods.correctPassword = async function(candidatePassword) {
  // Check if candidatePassword is provided and not empty
  if (!candidatePassword || candidatePassword.trim() === '') {
    return false; // Return false if candidatePassword is missing or empty
  }

  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changeTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000)
    console.log(changeTimeStamp, JWTTimestamp)
    return JWTTimestamp < changeTimeStamp
  }
  
  return false;
}

userSchema.methods.createPasswordForgottenToken = function() {
  const forgotToken = crypto.randomBytes(32).toString('hex');
  this.passwordForgotToken = crypto.createHash('sha256').update(forgotToken).digest('hex')
  this.passwordExpireToken = Date.now() + 1000 * 60 * 1000;
  console.log({ forgotToken }, this.passwordForgotToken)
  return forgotToken;
}


const User = mongoose.model('User', userSchema);
module.exports = User;

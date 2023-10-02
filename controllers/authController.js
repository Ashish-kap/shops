// const util = require('util') ---simple way below
const {promisify} = require('util')
const crypto = require('crypto')
const Userr = require('./../model/user');
const googleUser = require('./../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')

const signToken = id => {
    //return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
    return jwt.sign({id},"WE-MUST-ALL-SUFFER-ONE-OF-TWO-THINGS",{expiresIn:'90d'})
}


const createSendToken = (user,statusCode,res)=>{
    let token = signToken(user._id)
    const cookieOption = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly:true,
        sameSite: 'none'
    }
    // if(process.env.NODE_ENV === 'production') cookieOption.secure = true;
    cookieOption.secure = true
    res.cookie('jwt',token,cookieOption)
    //remove password from output
    user.password = undefined;
    res.status(statusCode).json({
           status:"success",
           token,
           data:{
               user: user
           }
    })
}



exports.signupp = async (req, res) => {
  try { 
    const {name,password,passwordConfirm,phoneNumber} = req.body;

    // Check if the user already exists in the jwtUser collection
    const userExists = await Userr.findOne({phoneNumber});
    if (userExists) {
      return res.status(400).json({
        status:"failed",
        message:"Phone number already exists. Please Login..!",
      });
    }

    
    // Check if any of the required variables are missing
    if (!name || !phoneNumber || !password || !passwordConfirm) {
            return res.status(403).json({
                status: "failed",
                message: "Missing required signup data. Please provide all the necessary information.",
            });
    }

    // Check if the password is at least 8 characters long
    if (password.length < 8) {
      return res.status(400).json({
        status: "failed",
        message: "Password must be at least 8 characters long.",
      });
    }

     if (phoneNumber.length !== 10) {
      return res.status(400).json({
        status: "failed",
        message: "Phone number must be 10 digits",
      });
    }

    if(password !== passwordConfirm){
        return res.status(406).json({
            status: "failed",
            message: "Password and confirm password is not matching.",
        });
    }

    let newUser = await Userr.create({
        name,
        phoneNumber,
        password,
    });
    await newUser.save();
    createSendToken(newUser, 200, res);

  } catch (err) {
    res.status(400).json({
        error:err,
        message:"something went wrong..! Try again later"
    });
    console.log(err);
  }
};



exports.loginWithPassword = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {

    if(!phoneNumber || !password){
        // return next(("please provide email and password",400));
        return res.status(401).json({
                status: 'failed',
                message: "Please provide phone number and password"
        });
    }
    // Find the user by email
    const user = await Userr.findOne({phoneNumber}).select('+password');
    if (!user) {
      // If user is not found, send an error response
      return res.status(404).json({ 
        error: 'User not found',
        message:"User not found..! Please provide valid phone number"
      });
    }

    // const correct = await user.correctPassword(password, user.password)
    if(!user || !(await user.correctPassword(password, user.password))){
        return res.status(401).json({
            status: 'failed',
            message: 'Incorrect phone number or password'
        });
    }
   
    createSendToken(user, 200, res);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};


exports.login = async(req,res,next)=>{
    try{

      const {email,password} = req.body;

      // Check if the user already exists in the User collection
      // const userExists = await googleUser.findOne({ email });
      // if (userExists) {
      //   return res.status(400).json({ 
      //     status:"failed",
      //     message: 'You tried signing in with a different authentication method than the one you used during signup. Please try again using your original authentication method.' });
      // }
      // check if email and password exist
        if(!email || !password){
            // return next(("please provide email and password",400));
            return res.status(401).json({
                status: 'failed',
                message: "please provide email and password"
              });
        }
        //check if user exist and password is correct
         const user = await Userr.findOne({email}).select('+password');
        // const correct = await user.correctPassword(password, user.password)
        if(!user || !(await user.correctPassword(password, user.password))){
            return res.status(401).json({
                status: 'failed',
                message: 'Incorrect email or password'
              });
        }
        //send data
        createSendToken(user,200,res)

    }catch(err){
        res.status(401).json({
            status:"failed",
            message:err.message
        })
    }
}

exports.logout = (req,res)=>{
  res.cookie('jwt','loggedout',{
    expires:new Date(Date.now()+10*1000),
    httpOnly:true
  })
  res.status(200).json({ status: "success" });
}

exports.protect = async(req,res,next)=>{
  try{
    // checking token if its there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    // console.log(token)
    }else if(req.cookies?.jwt){
        token=req.cookies.jwt
    }
    if(!token){
      return res.status(401).json({
        status:"failed",
        message:"user dont exist by this id or login with correct ID"
    })
        
    }
    // verify token
    // const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    const decoded = await promisify(jwt.verify)(token,"WE-MUST-ALL-SUFFER-ONE-OF-TWO-THINGS")

    console.log(decoded)
    //check if user still exist
    const freshUser = await Userr.findById(decoded.id)
    if(!freshUser){
      return res.status(401).json({
        status:"failed",
        message:"the user belonging to this token doesnt exist"
      })
        // return next(('the user belonging to this token doesnt exist'))
    }

    //check if user change the password after the token was issued
    if(await freshUser.changePasswordAfter(decoded.iat)){
      return res.status(401).json({
        status:"failed",
        message:"user recently change his password. plz login again!"
      })
        // return next(('user recently change his password. plz login again!',401))
    }
    //GRANT ACCESS TO PROTECTED ROUTE
    req.userr = freshUser;
    next();

  }catch(err){
      // handle jwt malformed error
      if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid token',
        });
      }

      // handle other errors
      return res.status(500).json({
        status: 'error',
        message: err.message,
      });
  }   
}

exports.restrictTo=(...roles)=>{
  return (req,res,next)=>{
    console.log(req.userr.role)
    if(!roles.includes(req.userr.role)){
      res.status(403).json({
        status:"failed",
        Message: "you dont have permission to perform this action"
      })
    }
    next()
  } 
}

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await Userr.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.forgotPassword = async(req,res,next)=>{
    // get user based on posted email
    const getUser = await Userr.findOne({email:req.body.email})  
    if(!getUser){
        // next(('there is no user with email address'))
        return res.status(401).json({
            status: 'failed',
            message: 'there is no user with email address'
          });
    }
    //generate the random reset token
    const forgotToken = getUser.createPasswordForgottenToken()
    await getUser.save({validateBeforeSave:false})
    //send it user's email ID
    const resetURL = `${req.protocol}://${req.get('host')}/users/reset/${forgotToken}`
    const message = `forgot your password ? submit a patch request with new password and confirmPassword to the :${resetURL}\n if you didnt forgot your password please ignore this email`
    try{
    // send mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ashishkap9@gmail.com',
        pass: 'kinmnimknrmlbkag'
      }
    });
    const mailOptions = {
      from: 'ashishkap9@gmail.com',
      to: req.body.email,
      subject:'your password reset token (valid for 10 mins only)',
      text:message
    };
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.status(200).json({
            status:"message",
            message:'token sent to email'
    })
    }catch(err){
        console.log(err)
        getUser.passwordExpireToken = undefined;
        getUser.passwordForgotToken = undefined;
        await getUser.save({validateBeforeSave:false})
        // next(('there was an error sending the email, please try later!'))
        res.status(500).json({
            status:"message",
            message:'there was an error sending the email, please try later!'
    })
    }
}

exports.resetPassword = async(req,res,next)=>{
    // get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await Userr.findOne({passwordForgotToken:hashedToken,passwordExpireToken:{$gt:Date.now()}})
    //if token has not expired and there is user, set new password
    if(!user){
        // return next(('token is invalid or has expired',401))
        res.status(401).json({
            status:"failed",
            message:'token is invalid or has expired'
        })
    }
    user.password =req.body.password
    user.passwordConfirm=req.body.passwordConfirm
    user.passwordForgotToken=undefined;
    user.passwordExpireToken=undefined;
    await user.save()
    
    // log the user in, send token
    createSendToken(user,200,res)
    
}


exports.updatePassword = async(req,res,next)=>{
    //get user from collection
    const getPwd = await Userr.findById(req.userr.id).select('+password');  
    //check if posted current password is matching
    if( !(await getPwd.correctPassword(req.body.passwordCurrent, getPwd.password))){
        return next(("password is not matching or wrong password",401))
    }
    //if password is correct , update password in databasero
    getPwd.password = req.body.password;
    getPwd.passwordCurrent = req.body.passwordCurrent
    getPwd.passwordConfirm = req.body.passwordConfirm
    await getPwd.save()
    // log in the user , and send the token
    createSendToken(getPwd,200,res)
}

const {  validationResult } = require('express-validator');
const { uuid } = require('uuidv4');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport')
//Render
exports.getSignUpPage = async (req,res) =>{
  res.render('auth/sign-up')
}

exports.getLoginPage = async (req,res) => {
  res.render('auth/login')
}

exports.getFormForgetPassword = async(req,res)=>{
  res.render('auth/forgot-password')
}

exports.getCheckToken = async (req,res) =>{
  const {token} = req.params
  const doctor = await prisma.doctor.findUnique({where:{confirmationToken:token}})

  if(!doctor){
    req.flash('error','There was an error changing you password, try again');
    res.redirect('auth/forgot-password')
  }

  res.render(`auth/reset-password`);
}

//API
exports.registerDoctor = async (req, res) => {
  let { name, email, password,specialty } = req.body;

  // Check if user already exists
  let doctor = await prisma.doctor.findUnique({ where: { email } });
  if (doctor) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create unique confirmation token
  const confirmationToken = uuid();  // or some other unique value

  // Create doctor
  doctor = await prisma.doctor.create({
    data: {
      name,
      email,
      specialty,
      password: hashedPassword,
      confirmationToken: confirmationToken,
    },
  });

  // Send confirmation email
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  let mailOptions = {
    from: "AdDoc.com",
    to: doctor.email,
    subject: 'Please confirm your email',
    html:`
            <p>Hi ${name}! confirm your account at AdDoc</p>
            <p>Your account is ready, you only need to confirm it on the next link: 
                <a href="${process.env.BACKEND_URL}:${process.env.PORT??3000}/confirm/${confirmationToken}">Confirm Account</a>
            </p>
            <p>If you didn't create this account ignore the email</p>`,

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.status(200).send('Registration successful. Please check your email to confirm your account.');
};


exports.postLogin =  (req, res,next) => {

  passport.authenticate('local', 
  { failureRedirect: '/login',
    successRedirect:'/doctors/dashboard'
  , failureFlash: true })(req, res, next);

};


exports.confirmEmail = async (req, res) => {
  const token = req.params.token;

  let doctor = await prisma.doctor.findUnique({ where: { confirmationToken: token } });

  if (!doctor) {
    return res.status(400).json({ msg: 'Invalid confirmation link' });
  }

  if (doctor.isConfirmed) {
    return res.status(400).json({ msg: 'Account is already confirmed' });
  }

  doctor = await prisma.doctor.update({
    where: { confirmationToken: token },
    data: { isConfirmed: true, confirmationToken: null },
  });

  res.status(200).send('Account confirmed. You can now log in.');
};

exports.logOut = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
};

// The route to request a password reset
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  let doctor = await prisma.doctor.findUnique({ where: { email } });
  if (!doctor) {
    return res.status(400).json({ msg: 'User not found' });
  }

  const confirmationToken = uuid();

  doctor = await prisma.doctor.update({
    where: { email },
    data: { confirmationToken },
  });

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  let mailOptions = {
    from: "AdDoc.com",
    to: doctor.email,
    subject: 'Reset your password',
    html:`
            <p>Hi ${doctor.name}! reset your password at AdDoc</p>
            <p>You need to click on the link to reset your password: 
                <a href="${process.env.BACKEND_URL}:${process.env.PORT??3000}/reset-password/${confirmationToken}">Reset password</a>
            </p>
            <p>If you didn't request this change ignore the email</p>`,

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.status(200).send('Please check your email to reset your password.');
};

// The route to submit the new password
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  let doctor = await prisma.doctor.findUnique({ where: { confirmationToken: token } });

  if (!doctor) {
    return res.status(400).json({ msg: 'Invalid password reset link' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  doctor = await prisma.doctor.update({
    where: { confirmationToken: token },
    data: { password: hashedPassword, confirmationToken: null },
  });

  res.status(200).send('Password reset successful. You can now log in with your new password.');
};

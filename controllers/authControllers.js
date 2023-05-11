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

//API
exports.registerDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
    text: 'Please confirm your email by clicking on the following link: \n\n' +
          'http://localhost:3000/confirm/' + confirmationToken,
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

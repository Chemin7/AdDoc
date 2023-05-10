const {  validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Render
exports.getSignUpPage = async (req,res) =>{
  res.render('auth/sign-up')
}

exports.getLoginPage = async (req,res) => {
  res.render('auth/login')
}

//API
exports.registerDoctor =  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { name, email, password,speciality } = req.body;
  console.log(email)
  // Check if user already exists
  let doctor = await prisma.doctor.findUnique({ where: { email } });
  if (doctor) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create doctor
  doctor = await prisma.doctor.create({
    data: {
      name,
      email,
      speciality,
      password: hashedPassword,
    },
  });

  // Create and assign a token
  const token = jwt.sign({ id: doctor.id }, process.env.SECRET_KEY);

  // Send confirmation email
  let transporter = nodemailer.createTransport({
    /*service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },*/
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
          'http://localhost:3000/confirm/' + token,
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

exports.postLogin = async (req, res) => {
    /*const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }*/
  
    let { email, password } = req.body;
  
    // Check if doctor exists
    let doctor = await prisma.doctor.findUnique({ where: { email } });
    if (!doctor) {
      return res.status(400).json({ msg: 'User does not exist' });
    }
  
    // Compare password
    const validPass = await bcrypt.compare(password, doctor.password);
    if(!validPass) return res.status(400).json({ msg: 'Invalid password' });
  
    // Check if doctor has confirmed email
    if (!doctor.confirmed) {
      return res.status(400).json({ msg: 'Please confirm your email to login' });
    }
  
    // Create and assign a token
    const token = jwt.sign({ id: doctor.id }, process.env.SECRET_KEY);
    res.header('auth-token', token).json({ msg: 'Logged in', token: token });
  };

exports.confirmEmail = async (req, res) => {
    const token = req.params.token;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const doctor = await prisma.doctor.findUnique({ where: { id: decoded.id } });
        if (!doctor) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        if (doctor.confirmed) {
            return res.status(400).json({ msg: 'This account has already been confirmed' });
        }

        await prisma.doctor.update({
            where: { id: decoded.id },
            data: { confirmed: true }
        });

        res.status(200).send('Your account has been confirmed. You can now log in.');

    } catch (err) {
        return res.status(400).json({ msg: 'Invalid token' });
    }
};

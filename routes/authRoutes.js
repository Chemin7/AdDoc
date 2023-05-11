const express = require('express');
const authRouter = express.Router();
const { registerDoctor, postLogin, confirmEmail,getLoginPage,getSignUpPage } = require('../controllers/authControllers');
const {registerDoctorValidator} = require('../helpers/validators')
authRouter.get('/login',getLoginPage);
authRouter.get('/sign-up',getSignUpPage);

authRouter.post('/sign-up',registerDoctorValidator, registerDoctor);
authRouter.post('/login', postLogin);
authRouter.get('/confirm/:token', confirmEmail);

module.exports = authRouter;

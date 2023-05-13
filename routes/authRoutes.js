const express = require('express');
const authRouter = express.Router();
const { registerDoctor, postLogin, confirmEmail,getLoginPage,getSignUpPage,logOut,getFormForgetPassword,forgotPassword,resetPassword,getCheckToken} = require('../controllers/authControllers');
const {registerDoctorValidator,checkPassword} = require('../helpers/validators')

authRouter.get('/login',getLoginPage);
authRouter.get('/sign-up',getSignUpPage);
authRouter.get('/forgot-password',getFormForgetPassword);
authRouter.get('/reset-password/:token',getCheckToken);

authRouter.post('/sign-up',registerDoctorValidator, registerDoctor);
authRouter.post('/login', postLogin);
authRouter.get('/confirm/:token', confirmEmail);
authRouter.get('/logout',logOut)
authRouter.post('/forgot-password',forgotPassword)
authRouter.post('/reset-password/:token',checkPassword, resetPassword)

module.exports = authRouter;

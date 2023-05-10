const express = require('express');
const authRouter = express.Router();
const { registerDoctor, postLogin, confirmEmail,getLoginPage,getSignUpPage } = require('../controllers/authControllers');

authRouter.get('/login',getLoginPage);
authRouter.get('/sign-up',getSignUpPage);

authRouter.post('/register', registerDoctor);
authRouter.post('/login', postLogin);
authRouter.get('/confirm/:token', confirmEmail);

module.exports = authRouter;

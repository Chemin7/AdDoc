const express = require('express');
const doctorController = require('../controllers/doctorControllers');
const isAuth = require('../middlewares/isAuth')
const {patientRegisterValidator} = require('../helpers/validators')
const doctorRouter = express.Router();

//Render
doctorRouter.get('/dashboard', isAuth, doctorController.getDashboardPage);
doctorRouter.get('/edit-patient/:id', isAuth, doctorController.getEditPatientPage);

//API
doctorRouter.post('/edit-patient/:id', isAuth, patientRegisterValidator, doctorController.editPatient);
doctorRouter.post('/register-patient', isAuth,patientRegisterValidator, doctorController.registerPatient);
doctorRouter.delete('/delete-patient/:id', doctorController.softDeletePatient);

module.exports = doctorRouter;

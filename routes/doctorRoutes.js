const express = require('express');
const doctorController = require('../controllers/doctorControllers');
const isAuth = require('../middlewares/isAuth')
const {patientRegisterValidator,patientEditValidator} = require('../helpers/validators')
const doctorRouter = express.Router();

//Render
doctorRouter.get('/dashboard', isAuth, doctorController.getDashboardPage);
doctorRouter.get('/edit-patient/:id', isAuth, doctorController.getEditPatientPage);
doctorRouter.get('/recipe/:id',isAuth, doctorController.getGenerateRecipePage)
doctorRouter.get('/record/:patientId',isAuth,doctorController.getPrescriptionRecordPage)
//API
doctorRouter.post('/edit-patient/:id', isAuth, patientEditValidator, doctorController.editPatient);
doctorRouter.post('/register-patient', isAuth,patientRegisterValidator, doctorController.registerPatient);
doctorRouter.delete('/delete-patient/:id', doctorController.softDeletePatient);
doctorRouter.post('/recipe/:patientId',doctorController.createPrescription);
doctorRouter.get('/prescription/:patientId/:progressNoteId',doctorController.getPatientPrescription);
doctorRouter.get('/delete-prescription/:patientId/:progressNoteId', doctorController.deletePatientPrescription);
module.exports = doctorRouter;

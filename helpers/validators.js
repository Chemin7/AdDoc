const { check, validationResult } = require('express-validator');

exports.registerDoctorValidator = [
  check('name').notEmpty().withMessage('Name is required.'),
  check('specialty').notEmpty().withMessage('Specialty is required.'),
  check('email').isEmail().withMessage('Must be a valid email.'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  check('repeatPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must be equal');
    }
    return true;
  }),

  
  (req, res, next) => {
    const errors = validationResult(req);
   
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      req.flash('formData', req.body);
      console.log(req.body)
      return res.redirect('/sign-up');
    }
    next();
  },
];


exports.patientRegisterValidator = [
  check('name').notEmpty().withMessage('Name is required.'),
  check('email').isEmail().withMessage('Please enter a valid email.'),
  check('age').isInt({ min: 0 }).withMessage('Please enter a valid age.'),
  check('gender').notEmpty().withMessage('Gender is required.'),
  check('address').notEmpty().withMessage('Address is required.'),
  check('phoneNumber').notEmpty().withMessage('Phone number is required.'),
  check('religion').notEmpty().withMessage('Religion is required.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      req.flash('formData', req.body);
      console.log(req.body)
      return res.redirect('/doctors/dashboard');
    }
    next();
  },
];

exports.patientEditValidator = [
  check('name').notEmpty().withMessage('Name is required.'),
  check('email').isEmail().withMessage('Please enter a valid email.'),
  check('age').isInt({ min: 0 }).withMessage('Please enter a valid age.'),
  check('gender').notEmpty().withMessage('Gender is required.'),
  check('address').notEmpty().withMessage('Address is required.'),
  check('phoneNumber').notEmpty().withMessage('Phone number is required.'),
  check('religion').notEmpty().withMessage('Religion is required.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      req.flash('formData', req.body);
      return res.redirect(`/doctors/edit-patient/${req.body.id}`);
    }
    next();
  },
];

exports.checkEmail = [
  check('email').isEmail().withMessage('Please enter a valid email.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
     
      return res.redirect(`/forgot-password`);
    }
    next();
  },
]

exports.checkPassword = [
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect(`/reset-password/${req.params.token}`);
    }
    next();
  },
];

const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const passportConfig = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes= require('./routes/doctorRoutes')
const app = express();



const PORT = process.env.PORT || 3000;

require('dotenv').config();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  if(req.session.flash.formData){
    res.locals.formData = req.session.flash.formData[0]; // without removing the data
  }
  next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport)
// Set view engine
app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static('public'));

// Routes

app.get('/',(req,res)=>{
    res.send("hola mundo")
})
app.use('/', authRoutes);

app.use('/doctors',doctorRoutes);

// Catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// Error handler
/*
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


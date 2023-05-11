const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

module.exports = function(passport) {
  passport.use("local",
    new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req,email, password, done) => {
      // Match doctor
      try{
      let doctor = await prisma.doctor.findUnique({ where: { email: email } });
      
      if (!doctor) {
        return done(null, false, req.flash('error', 'Email no registrado'));
      }

      const isValidPassword = await bcrypt.compare(password, doctor.password);

      if (!isValidPassword) {
        return done(null, false, req.flash('error', 'Incorrect password'));
      }

      if(!doctor.isConfirmed){
        return done(null, false, req.flash('error', 'Account not verified'));
      }

      return done(null, doctor);
    }catch(err){
      console.log(err)
      return done(error);
    }
    })
  );

  passport.serializeUser((doctor, done) => {
    done(null, doctor.id);
  });

  passport.deserializeUser(async (id, done) => {
    let doctor = await prisma.doctor.findUnique({ where: { id: id } });
    done(null, doctor);
  });
};

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.SECRET_KEY;
  
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    let doctor = await prisma.doctor.findUnique({ where: { id: jwt_payload.id } });
    if (doctor) {
      return done(null, doctor);
    } else {
      return done(null, false);
    }
  }));
};


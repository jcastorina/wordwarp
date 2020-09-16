const mongoose = require('mongoose');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const Users = mongoose.model('Users');

passport.use(new LocalStrategy(
  function(username, password, done) {

    Users.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log('no user (in passport-config.js)')
        return done(null, false, { message: 'Incorrect username' }, 400);
      }
      if (!user.validatePassword(password)) {
        console.log('bad pass (in passport-config.js)')
        return done(null, false, { message: 'Incorrect password' }, 400);
      }
      console.log('validated (in passport-config.js)')
      return done(null, user);
    });
  }
));
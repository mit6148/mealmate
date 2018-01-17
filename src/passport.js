const passport = require('passport');
const fbp = require('passport-facebook');

const User = require('./models/user');

// set up passport configs
passport.use(new fbp.Strategy({
  clientID: '146983506010561',
  clientSecret: '58a99a3e4e9dcdc6365c7494d02292c0',
  callbackURL: '/auth/facebook/callback'
}, function(accessToken, BrefreshToken, profile, done) {
  User.findOne({'fbid': profile.id }, function(err, user) {
    if (err){
    	return done(err);
    } 

    if (!user) {
       user = new User({
        name: profile.displayName,
        fbid: profile.id
      });

      user.save(function(err) {
        if (err) console.log(err);

        return done(err, user);
      });
    } else {
      return done(err, user);
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
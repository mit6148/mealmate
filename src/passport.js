const passport = require('passport');
const fbp = require('passport-facebook');

const User = require('./models/user');

// set up passport configs
passport.use(new fbp.Strategy({
  clientID: '146983506010561',
  clientSecret: '58a99a3e4e9dcdc6365c7494d02292c0',
//  profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
  callbackURL: '/auth/facebook/callback',
  profileFields: ['displayName', 'email']
}, function(accessToken, BrefreshToken, profile, done) {
  User.findOne({'fbid': profile.id }, function(err, user) {
    if (err){
    	return done(err);
    } 

    var newEmail = "";
    if (!user) {
      if (profile.emails != null){
        newEmail = profile.emails[0].value;
      }
      user = new User({
      name: profile.displayName,
      fbid: profile.id,
      email: newEmail,
      course: "",
      year: "",
      about: "",
      residence: "",
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
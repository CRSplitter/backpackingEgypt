var passport = require("passport");
var User = require("./models/user");
var LocalStrategy = require("passport-local").Strategy;
var passportJWT = require("passport-jwt")
var ExtractJwt = passportJWT.ExtractJwt
var JwtStrategy = passportJWT.Strategy

//
// module.exports = function() {
//     passport.serializeUser(function(user, done) {
//         done(null, user._id);
//     });
//     passport.deserializeUser(function(id, done) {
//         User.findById(id, function(err, user) {
//             done(err, user);
//         });
//     });
// };
//
//
// passport.use("login", new LocalStrategy(
//     function(username, password, done) {
//         User.findOne({ username: username }, function(err, user) {
//             if (err) {
//                 return done(err);
//             }
//             if (!user) {
//                 return done(null, false, {
//                     message: "No user has that username!"
//                 });
//             }
//             user.checkPassword(password, function(err, isMatch) {
//                 if (err) {
//                     return done(err);
//                 }
//                 if (isMatch) {
//                     return done(null, user);
//                 } else {
//                     return done(null, false, {
//                         message: "Invalid password."
//                     });
//                 }
//             });
//         });
//     }));

    module.exports = function(passport) {
      var opts = {};
      opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
      opts.secretOrKey = config.secret;
      passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
            return done(err, false);
          }
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        });
      }));
    };

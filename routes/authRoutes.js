const express = require("express");
const User = require("../models/user");
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken')
const secret = 'thisismytopsecret'


var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    var buf = crypto.randomBytes(16);
    cb(null, Date.now() + buf.toString('hex') + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage
});


router.post("/signup", upload.single('profile_picture'), function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var description = req.body.description;


    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return res.status(500).json({
          error: true,
          message: err
        })
      }

      if (user) {
        console.log('user already exist');
        return res.json({
          error: true,
          message : 'this user already exist'
        })


      }
      var newUser;
      if (req.file) {
        newUser = new User({
          username: username,
          password: password,
          description: description,
          profile_picture: req.file.filename
        });
      } else {

        newUser = new User({
          username: username,
          password: password,
          description: description

        });
      }
      newUser.save(next)
      });
    }, function(req, res, next){
      return res.status(200).json({
        error: false,
        message: 'registered successfully!'
      })
    });


  router.post('/login', function(req, res) {
    if(req.user){
      return res.status(403).json({
        error: true,
        message: 'already signed in'
      })
    }
    if(!req.body.username || !req.body.password){
      return res.json({
        success: false,
        message: 'Name or password is missing'
      })
    }
    username = req.body.username
    password = req.body.password
    // find the user
    User.findOne({ username: username }).populate('backpacker').exec(function(err, user) {

      if (err) throw err;

      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {
        // check if password matches
        user.checkPassword(password, function(err, isMatch){
          if (err) {
            res.json({
              success: false,
              message: 'Authentication failed. Wrong password.' });
            } else {
              // if user is found and password is right
              // create a token
              var token = jwt.sign(user, secret);
              // return the information including token as JSON
              req.user = user
              res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token,
                user: user
              });
            }
        })
      }
    });
  });


  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  module.exports = router;

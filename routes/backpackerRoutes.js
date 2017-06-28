const express = require("express");
const User = require("../models/user");
const Backpacker = require("../models/backpacker")
const backpackerMiddleware = require('../middlewares/backpackerMiddleware')
const router = express.Router();
let authenticated = require("../authenticated")
// const passport = require("passport");
// const multer = require('multer');
// const crypto = require('crypto');
// const path = require('path');

router.post('/apply', authenticated, function(req, res, next) {
  console.log(req.user);
  if (!req.user._id) {
    return res.status(403).json({
      error: true,
      message: 'a user is not provided'
    })
  }
  let user = req.user
  User.findOne({
    _id: user._id
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'error finding the backpacker'
      })
    }
    if (!user) {

      res.status(404).json({
        error: true,
        message: 'user not found'
      })
    }

    if (user.backpacker) {
      return res.status(403).json({
        error: true,
        message: 'You have already applied, please wait your request is pending!'
      })
    }
    newBackpacker = new Backpacker({
      _id: req.user._id,
      verified: 1,
      avgRating: 0,
      raters:0
    })
      return newBackpacker.save(function(err) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: true,
            message: 'error saving the backpacker'
          })
        }
        user.backpacker = newBackpacker._id
        user.isBackpacker = 1
        user.save(function(err){
          if(err){
            return res.status(500).json({
              error: true,
              message: 'error saving the user'
            })
          }
          return res.status(200).json({
            error: true,
            message: 'your request is sent please wait for confirmation'
          })

        })
      })
  })
})

// backpackerMiddleware,

router.get('/myprofile', authenticated,  function(req, res, next) {
  // console.log(req.user)
  // res.json({
  //   user: req.user
  // })
  if(!req.user) {
    return res.json({
      error: true,
      message: 'user not provided in the request'
    })
  }
  User.findOne({ _id: req.user._id }).populate('backpacker').exec(function(err, user) {
    if(err) {
      return res.status(500).json({
        error: true,
        message: 'error finding user!'
      })
    }
    if(!user) {
      return res.status(404).json({
        error: true,
        message: 'user not found!'
      })
    }
    res.status(200).json({
      error: false,
      user: user
    })
  })
})

module.exports = router

const express = require("express");
const User = require("../models/user");
const Backpacker = require("../models/backpacker")
const backpackerMiddleware = require('../middlewares/backpackerMiddleware')
const router = express.Router();
let authenticated = require("../authenticated")

router.post('/rateBackpacker:username',authenticated , function(req, res) {
  if(!req.body.avgRating) {
    return res.status(400).json({
      error: true,
      message: 'you haven`t provided any rating'
    })
  }
  // console.log(req.params.username);
  let str = (req.params.username).slice(1)
  // console.log(str);
  User.findOne({ username: str }).populate('backpacker').exec(function(err, user){
    if (err) {
      return res.status(400).json({
        error: true,
        message: err
      })
    }
    if(!user) {
      return res.status(404).json({
        error: true,
        message: 'user not found!'
      })
    }


    // console.log(raters);
    // console.log('bla');
    // let raters = ++(user.backpacker.raters);
    // console.log(user.backpacker.avgRating);
    // console.log(req.body.avgRating);
    // console.log(raters);
    // let result = (user.backpacker.avgRating + req.body.avgRating)/ raters
    // console.log(result);

    user.backpacker.avgRating = 6
    user.isBackpacker = 2
    user.markModified('backpacker');

    user.save(function(err){
      if(err){
        res.status(500).json({
          error: true,
          message: 'user not rated'
        })
      }
      res.status(200).json({
        error: false,
        message: "rating done successfully"
      })
      console.log(user);
    })

  })
})

module.exports = router

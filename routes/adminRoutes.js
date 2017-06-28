const express = require("express");
const User = require("../models/user");
const Backpacker = require("../models/backpacker")
const backpackerMiddleware = require('../middlewares/backpackerMiddleware')
const router = express.Router();
let authenticated = require("../authenticated")

router.get('/hey', function(req, res){
  res.send('hey there!')
})

router.get('/viewRequests', function(req, res) {
  // console.log('hello');
  console.log(req.user);
  User.find({ isBackpacker: 1 }).populate('backpacker').exec(function(err, backpackers) {
      if(err) {
        return res.status(500).json({
          error: 'true',
          message: `Database error, can't find backpackers`
        })
      }
      if(backpackers.length == 0){
        return res.status(200).json({
          error: 'false',
          message: 'no available requests'
        })
      }
      res.status(200).json({
        error: 'false',
        backpackers: backpackers
      })
    })

})

router.post('/verifyBackpacker:username', authenticated, function(req, res) {

  let str = (req.params.username).slice(1)
  User.findOne({ username: str }, function(err, user) {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'cannot find backpacker'
      })
    }

    if(!user) {
      return res.status(404).json({
        error: true,
        message:'no backpaacker found!'
      })
    }
    console.log(user);
    user.isBackpacker = 2
    user.save(function(err){
      if(err) {
        return res.status(500).json({
          error: true,
          message: 'cannot verify user as backpacker'
        })
      }
      res.status(200).json({
        error: false,
        message: 'user verified as backpacker successfully'
      })
    })

  })
})

module.exports = router

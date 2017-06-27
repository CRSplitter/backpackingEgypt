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

router.post('/verifyBackpacker:username', function(req, res) {
  User.findOne({ username: req.param.username }, function(err, backpacker) {
    if (err) {
      return res.status(500).json({
        error: true,
        message: 'cannot find backpacker'
      })
    }
    backpacker.isBackpacker = 2
    backpacker.save(function(err){
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

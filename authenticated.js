const secret = require('./secret')
const jwt = require('jsonwebtoken')

module.exports = function authenticated(req, res, next) {
  // if(req.user) {
  //
  // }
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, secret.secret, function(err, user) {
      console.log(err);
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.user = user._doc;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
}

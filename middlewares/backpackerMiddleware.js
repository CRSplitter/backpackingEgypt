

module.exports = function(req, res, next) {
  console.log(req.user);
    if(!(req.user.verified == 2)) {
        return res.status(403).json({
            error:'true',
            message: 'Access denied'
        });
    } else {
        next();
    }
};

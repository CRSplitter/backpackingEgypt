const mongoose = require ("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;
const SALT_FACTOR = 10;

// user schema
const userSchema = Schema({

  username: {   type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: {   type: String, required:true },
  createdAt: { type: Date, default: Date.now },
  profile_picture: String,
  description: String,
  displayName: String,
  country: String,
  isAdmin: false,
  isBackpacker: 0,
  backpacker: { type: mongoose.Schema.Types.ObjectId , ref:'Backpacker' }


  // verified: Boolean

});


userSchema.methods.name = function() {
return this.displayName || this.username;
};



//hashing
let noop = function() {};
userSchema.pre("save", function(done) {
    var user = this;
    if (!user.isModified("password")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) {
            return done(err);
        }
        bcrypt.hash(user.password, salt, noop,
            function(err, hashedPassword) {
                if (err) {
                    return done(err);
                }
                user.password = hashedPassword;
                done();
            });
    });
});



userSchema.methods.checkPassword = function(guess, done) {
bcrypt.compare(guess, this.password, function(err, isMatch) {
done(err, isMatch);
  });
};



let User = mongoose.model("User", userSchema);

module.exports = User;

const mongoose = require ("mongoose");
const Schema = mongoose.Schema;


const backpackerSchema = Schema({

  user: { type: mongoose.Schema.Types.ObjectId , ref:'User' },
  country: String,
  photos: [{ type: String }],
  avgRating: Number,
  verified: Number
  // verified: Boolean

});
let Backpacker = mongoose.model("Backpacker", backpackerSchema);
module.exports = Backpacker

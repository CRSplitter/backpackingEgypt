const mongoose = require('mongoose')
const Schema = mongoose.Schema


const citySchema = Schema({
  name: String,
  description: String,
  avgRating: Number,
  photos:[{ type: String }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId , ref:'Review'}]
})

let City = mongoose.model("City", citySchema);
module.exports = City;

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = Schema({
  _creator: { type: mongoose.Schema.Types.ObjectId , ref:'User' },
  content: String
})

let Review = mongoose.model('Review', reviewSchema)
module.exports = Review

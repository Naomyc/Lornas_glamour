const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  description: { type: String },
  isDeleted: { type: Boolean, default: false }, 
});

module.exports = mongoose.model('Category', CategorySchema);

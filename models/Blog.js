var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  title: String,
  url: String,
  days_until_nag: Number,
});

module.exports = mongoose.model('Blog', blogSchema);

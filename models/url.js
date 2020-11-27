const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  alias: { type: String, index: true },
  url: String,
  date: Date
});

module.exports = mongoose.model('Url', UrlSchema);
const mongoose = require('mongoose');
const md5 = require('blueimp-md5');

// Schema
const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  phone: String,
  email: String,
  create_time: {type: Number, default: Date.now},
  role_id: String
});

module.exports = mongoose.model('users', userSchema);
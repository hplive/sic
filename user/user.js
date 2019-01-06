var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  street: String,
  door: String,
  password: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
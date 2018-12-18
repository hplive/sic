const mongoose = require('mongoose');


let AddressSchema = new mongoose.Schema ({
    street : String,
    cpPrefix : Number,
    cpSuffix : Number
});

module.exports = mongoose.model('Address', AddressSchema);
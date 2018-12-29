const mongoose = require('mongoose');
const schema = mongoose.Schema;


let AddressSchema = new mongoose.Schema ({
    street : String,
    door : String,
    postalCodeCity : Number,
    postalCodeStreet : Number
});

module.exports = mongoose.model('Address', AddressSchema);
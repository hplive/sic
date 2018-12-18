const mongoose = require('mongoose');

let CustomerSchema = new mongoose.Schema ({
    customerId : Number,
    name: String,
    email : String,
    address : { type: mongoose.Schema.Types.ObjectId, ref: "Address"}
});

module.exports = mongoose.model('Customer', CustomerSchema);
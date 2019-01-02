const mongoose = require('mongoose');

let CustomerSchema = new mongoose.Schema ({
    name: String,
    email : String,
    phone : Number,
    address : { type: mongoose.Schema.Types, ref: "Address"}
});

module.exports = mongoose.model('Customer', CustomerSchema);
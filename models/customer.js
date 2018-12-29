const mongoose = require('mongoose');
const schema = mongoose.Schema;

let CustomerSchema = new mongoose.Schema ({
    name: String,
    email : String,
    phone : Number,
    address : { type: mongoose.Schema.Types.ObjectId, ref: "Address"}
});

module.exports = mongoose.model('Customer', CustomerSchema);
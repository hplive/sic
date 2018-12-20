const mongoose = require('mongoose');


let OrderSchema = new mongoose.Schema ({
    customer : { type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
    address : { type: mongoose.Schema.Types.ObjectId, ref: "Address"},
    state : { type: mongoose.Schema.Types.ObjectId, ref: "State"},
    item : { type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
    totalPrice: Number
});

module.exports = mongoose.model('Order', OrderSchema);
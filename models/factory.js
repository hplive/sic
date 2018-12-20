const mongoose = require('mongoose');


let FactorySchema = new mongoose.Schema ({
    address : { type: mongoose.Schema.Types.ObjectId, ref: "Address"},
    orders : { type: mongoose.Schema.Types.ObjectId, ref: 'Order'}
});

module.exports = mongoose.model('Factory', FactorySchema);
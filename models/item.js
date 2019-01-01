const mongoose = require('mongoose');
var Schema = mongoose.Schema;

let ItemSchema = new Schema ({
    productId : Number,
    name: String,
    price: Number,
    category: String,
    material : String,
    finish : String,
    width : Number,
    height : Number,
    depth : Number,
    children : { type: ['../models/Item.js'] },
});

module.exports = mongoose.model('Item', ItemSchema);
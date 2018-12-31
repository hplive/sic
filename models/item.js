const mongoose = require('mongoose');
var Schema = mongoose.Schema;

let ItemSchema = new Schema ({
    _id: Schema.Types.ObjectId,
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
},{_id:false});

module.exports = mongoose.model('Item', ItemSchema);
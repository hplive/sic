const mongoose = require('mongoose');
const schema = mongoose.Schema;

let ItemSchema = new mongoose.Schema ({
    productId : Number,
    name: String,
    price: Number,
    category: String,
    material : String,
    finish : String,
    width : Number,
    height : Number,
    depth : Number,
    children : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
});

module.exports = mongoose.model('Item', ItemSchema);
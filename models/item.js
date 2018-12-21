const mongoose = require('mongoose');
const schema = mongoose.Schema;

let ItemSchema = new mongoose.Schema ({
    productId : Number,
    name: String,
    price: Number,
    category: String,
    material : String,
    finish : String,
    dimension : {type : mongoose.Schema.Types.ObjectId, ref: 'Dimension'},
    children : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
});

module.exports = mongoose.model('Item', ItemSchema);
const mongoose = require('mongoose');
const schema = mongoose.Schema;

let ProductSchema = new mongoose.Schema({
    name: {type: String, required: true, max: 100},
    price: {type: Number, required: true},
});

module.exports = mongoose.model('Product', ProductSchema);
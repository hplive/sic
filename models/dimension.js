const mongoose = require('mongoose');

let DimensionSchema = new mongoose.Schema ({
    width : Number,
    height : Number,
    depth : Number
});

module.exports = mongoose.model('Dimension', DimensionSchema);
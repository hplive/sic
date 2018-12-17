//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var EncomendaSchema = new Schema({
    items:{
        type: ['../models/Item.js']
    }
});
module.exports = mongoose.model('Encomenda', EncomendaSchema );
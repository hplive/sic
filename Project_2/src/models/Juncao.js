//Require Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ItemSchema = new Schema({
    nome: String,
    descricao: String,
    materiais: [{ type: String}],
    dimensao: { type: Schema.Types.ObjectId, ref: 'Dimensao'},
    categoria: String,
    agregados:   {
        type: ['../models/Item.js']
    }
},{_id:false});
//Define a schema
var Schema = mongoose.Schema;

var JuncaoSchema = new Schema({
    agregador: ItemSchema,
    agregado:  ItemSchema,
});
module.exports = mongoose.model('Juncao', JuncaoSchema );

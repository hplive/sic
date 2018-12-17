//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

class Item{
    constructor(nome, descricao, materiais, dimensao, categoria){
        this.nome=nome;
        this.descricao=descricao;
        this.materiais=materiais;
        this.dimensao=dimensao;
        this.categoria=categoria;
    }
}
module.exports=Item;
var ItemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    nome: String,
    descricao: String,
    materiais: [{ type: String}],
    dimensao: { type: Schema.Types.ObjectId, ref: 'Dimensao'},
    categoria: String,
    agregados:   {
        type: ['../models/Item.js']
    }
},{_id:false});
module.exports = mongoose.model('ItemSchema', ItemSchema );
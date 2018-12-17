//Require Mongoose
var mongoose = require('mongoose');

class Dimensao{
    constructor(altura, largura, profundidade){
        this.altura=altura;
        this.largura=largura;
        this.profundidade=profundidade;
    }
}
module.exports=Dimensao;
//Define a schema
var Schema = mongoose.Schema;

var DimensaoSchema = new Schema({
    altura: Number,
    largura: Number,
    profundidade: Number
});
module.exports = mongoose.model('Dimensao', DimensaoSchema );

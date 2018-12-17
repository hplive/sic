let Juncao = require('../models/Juncao')
let express = require('express')
let ItemSchema=require('../models/Item')
let router = express.Router()
var mongoose=require('mongoose')

function cabe(dimPai, dimFilho){
  var larguraPai=dimPai.largura;
  var alturaPai=dimPai.largura;
  var profundidadePai=dimPai.largura;

  var larguraFilho=dimFilho.largura;
  var alturaFilho=dimFilho.largura;
  var profundidadeFilho=dimFilho.largura;

  if(larguraPai>larguraFilho && alturaPai>alturaFilho && profundidadePai>profundidadeFilho){
      return 1;
  }
  return -1;
}


router.post('/juncao', (req, res) => {

    let data = req.body
    var dimPai=data.agregador.dimensao;
    var dimFilho=data.agregado.dimensao;
    var aux= cabe(dimPai, dimFilho);
   if(aux>0){
     model=new Juncao(data);
   //  var agregador=new ItemSchema(data.agregador);res.send(agregador);
    model.save()
      .then(doc => {
        res.status(201).send(doc)
      })
      .catch(err => {
        res.status(500).json(err)
      })
    }else{
        res.send('Dimensoes incompativeis');
    }
  });
  module.exports = router
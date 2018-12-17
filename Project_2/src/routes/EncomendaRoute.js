let Encomenda = require('../models/Encomenda')
let Item=require('../models/Item')
let juncao=require('../models/Juncao')
let express = require('express')
let http = require('https')
let router = express.Router()
var rp = require('request-promise')
var mongoose=require('mongoose')


// direct way

// Cria uma encomenda
// POST localhost:3000/customer
router.post('/encomenda', (req, res) => {

  let model = new Encomenda(req.body)
  model.save()
    .then(doc => {
      res.status(201).send(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// GET /id
router.get('/encomenda/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Missing URL parameter: id')
  }
  var idE = req.params.id;
  Encomenda.findOne({
    _id: idE
  })
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// GET /id/items
router.get('/encomenda/:id/itens', (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Missing URL parameter: id')
  }
 var idE=req.params.id;
 Encomenda.findOne({_id: idE}).select('-_id').select('-__v')
  .then(doc=>{
    if(err) throw err;
      res.send(doc);
  });
})

// UPDATE
router.put('/encomenda/:idE/:idP', async (req, res) => {
  const idE = req.params.idE;
  const idP = req.params.idP;
  var received = '';



  try{
    var data=JSON.stringify(req.body)
    const options = {
      hostname: 'projectsicgest.azurewebsites.net',
   //   port: 5000,
      path: '/api/encomendas/?id=' + idP,
      method: 'POST',
      strictSSL: false,
      "rejectUnauthorized": false,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };


    const req1 = http.request(options, (resp) => {
      console.log(`statusCode: ${resp.statusCode}`)
      resp.on('data', async (d) => {
        await process.stdout.write('while requesting... '+d);
        received += d;
  
      });
      resp.on('end', async () => {
        if (resp.statusCode !== 200) {
          res.status(resp.statusCode).send(received);
        } else {
          try {
           var toSave = JSON.parse(received)
            var myquery = { _id: idE };
            var newvalues = { $push: { items: toSave } };
              Encomenda.updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("\n1 document updated");
              });
              res.status(201).send(toSave)
          } catch(err) {
            console.error('Update error: '+err)
            res.status(305).send('Não foi possivel atualizar');
          }
        }
      });
      resp.on('data', (d) => {
            process.stdout.write(d)
      })
    })
  
    req1.on('error', (err) => {
      console.error('Req error '+err)
    })
    req1.write(data)
    req1.end()
  }catch(err){
    console.log('Parse Error: '+err)
    res.status(400).send('Invalid body');
  }




})
// DELETE
router.delete('/encomenda/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Missing URL parameter: id')
  }

  Encomenda.findOneAndRemove({
    _id: req.params.id
  })
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

module.exports = router
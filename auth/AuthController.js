// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/user');

const axios = require('axios');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

const uri = 'https://nucleocs.azurewebsites.net/api/Account';

router.post('/register',async function(req, res) {
       await axios.post(uri, req.body)
      .then(response => {
      }).catch(error => {
          if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
          } else if (error.request) {
              console.log(error.request);
          } else {
              console.log('Error', error.message);
          }
          console.log(error.config);
          return null;
      });
      res.status(200).send();
    });

  router.get('/:name',async function(req, res) {
    var loginUri=uri+'/'+req.params.name;
    var result=await axios.get(loginUri)
    .then(response => {
        return response.data;
    }).catch(error => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
        return null;
    });
    res.status(200).send(result);
  });

  router.post('/login',async function(req, res) {
      var loginUri=uri+'/'+'login';
    await axios.post(loginUri, req.body)
    .then(response => {
    }).catch(error => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
        return null;
    });
    res.status(200).send();
  });

  router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });
  module.exports=router;
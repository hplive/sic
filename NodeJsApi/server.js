// Server js
const mongoose = require('mongoose');
const cors = require('cors')

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//app.use(cors)

let dev_db_url = "mongodb://username:password@url";
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const product = require('./routes/product'); //Import product routes
const order = require('./routes/order');
const item = require('./routes/item');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/products', product);
app.use('/order', order);
app.use('/item', item);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://encarnado:Reconquista2018@ds016148.mlab.com:16148/encomendas';
mongoose.connect(mongoDB, {useNewUrlParser: true})
.then(() => {
console.log('mongoDB is connected...')
})
.catch((err) => {
throw err
})

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
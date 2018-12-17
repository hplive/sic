let express = require('express')
let app = express()
let context = require('./db/context')
let path = require('path')
let bodyParser = require('body-parser')
let encomendaRouter=require('../src/routes/EncomendaRoute')
let JuncaoRoute=require('../src/routes/JuncaoRoute')

app.use(bodyParser.json())

app.use((req, res, next) => {
  next()
})
app.use((encomendaRouter));
app.use(((JuncaoRoute)));
// Handler for 404 - Resource Not Found
app.use((req, res, next) => {
  res.status(404).send('Page not found!')
})

// Handler for Error 500
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.sendFile(path.join(__dirname, '../public/500.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.info(`Server has started on ${PORT}`))
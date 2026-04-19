const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const setupRoutes = require('./routes/index.js');
const conectDB = require('./models/database.js')

//logger setup
app.use(morgan('dev'))

conectDB();

app.use(express.static(path.join(__dirname, 'public')))
// View engine setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// body parser setup
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Routing setup

setupRoutes(app)

module.exports = app 

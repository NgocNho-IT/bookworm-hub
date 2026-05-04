require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const setupRoutes = require('./routes/index.js');
const connectDB = require('./models/database.js');

// Kết nối MongoDB
connectDB();

//logger setup
app.use(morgan('dev'))

// Parse cookies với secret key để signed cookies
app.use(cookieParser(process.env.COOKIES_KEY));

app.use(express.static(path.join(__dirname, 'public')))

// View engine setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// body parser setup
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

setupRoutes(app)

module.exports = app 

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const setupRoutes = require('./routes/index.js');
const connectDB = require('./models/database.js');

const app = express();

// Kết nối MongoDB
connectDB();

// Logger setup
app.use(morgan('dev'));

// Parse cookies với secret key để signed cookies
app.use(cookieParser(process.env.COOKIES_KEY));

// Cấu hình static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(methodOverride('_method')); 


setupRoutes(app);

module.exports = app;
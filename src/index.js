require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override'); // 1. Thêm require này vào

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

// Body parser setup (Phải đặt TRƯỚC method-override)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Kích hoạt method-override: Đánh tráo method POST thành DELETE/PUT dựa trên query string ?_method=
app.use(methodOverride('_method')); 

// 3. Setup Routes (Phải đặt SAU method-override)
setupRoutes(app);

module.exports = app;
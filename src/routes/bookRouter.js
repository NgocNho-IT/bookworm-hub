const express = require('express');
const bookRouter = express.Router();
const bookController = require('../controllers/bookController.js');

bookRouter.get('/', bookController.getAll);
bookRouter.get('/:id', bookController.bookDetail);
module.exports = bookRouter;
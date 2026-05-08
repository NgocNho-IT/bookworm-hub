const express = require('express');
const bookRouter = express.Router();
const bookController = require('../controllers/bookController.js');

bookRouter.get('/', bookController.getAll);

// add book
bookRouter.get('/create-book', bookController.createBook);
bookRouter.post('/create', bookController.create);

// update book
bookRouter.get('/update-book/:id', bookController.updateBook);
bookRouter.put('/update/:id', bookController.update);

// delete book
bookRouter.delete('/delete-book/:id', bookController.deleteBook);

// book detail
bookRouter.get('/:id', bookController.bookDetail);

module.exports = bookRouter;
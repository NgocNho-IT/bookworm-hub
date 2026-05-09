const bookService = require('../services/bookService');

async function getAll(req, res, next) {
    try {
        const options = {
            search: req.query.q,
            categorySlug: req.query.category,
            statusSlug: req.query.status,
            page: Math.max(1, parseInt(req.query.page) || 1),
            perPage: 4
        };

        const result = await bookService.getBooksAdvanced(req.user._id, options);

        res.render('books/all', {
            books: result.books, 
            currentPage: result.currentPage, 
            totalPages: result.totalPages, 
            currentQuery: req.query, 
            title: 'Book page'
        });
    } catch (err) {
       next(err);
    }
}

async function createBook(req, res, next) {
    try {
        const { categories, statuses } = await bookService.getBookMetadata();
        res.render('books/create', { 
            categories, 
            statuses, 
            error: null, 
            book: {} 
        });
    } catch (err) { next(err); }
}

async function create(req, res, next) {
    try {
        await bookService.createBook(req.body, req.user._id);
        res.redirect('/books');
    } catch (err) { next(err); }
}

async function updateBook(req, res, next) {
    try {
        const [book, metadata] = await Promise.all([
            bookService.getBookById(req.params.id, req.user._id),
            bookService.getBookMetadata()
        ]);

        res.render('books/update', {
            book,
            categories: metadata.categories,
            statuses: metadata.statuses,
            error: null
        });
    } catch (err) { next(err); }
}

async function update(req, res, next) {
    try {
        await bookService.updateBook(req.params.id, req.user._id, req.body);
        res.redirect('/books');
    } catch (err) { next(err); }
}

// Xóa sách: Đã dọn dẹp IF dư thừa
async function deleteBook(req, res, next) {
    try {
        await bookService.deleteBook(req.params.id, req.user._id);
        res.redirect('/books');
    } catch (err) {
        next(err);
    }
}


async function bookDetail(req, res, next) {
    try {
        const book = await bookService.getBookById(req.params.id, req.user._id);
        res.render('books/detail', { book, title: 'Book detail' });
    } catch (err) {
        next(err);
    }
}

module.exports = { 
    getAll,
    createBook,
    create,
    updateBook,
    update,
    deleteBook,
    bookDetail
};
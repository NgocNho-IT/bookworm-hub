const bookService = require('../services/bookService');
const { bookSchema } = require('../helpers/joi_helper');
async function getAll(req, res) {
    try {
        // Đóng gói tất cả params/query từ URL thành 1 object
        const options = {
            search: req.query.q,
            categorySlug: req.query.category,
            statusSlug: req.query.status,
            page: Math.max(1, parseInt(req.query.page) || 1),
            perPage: 4
        };

        // Quăng cho Service xử lý
        const result = await bookService.getBooksAdvanced(req.user._id, options);

        res.render('books/all', {
            books: result.books, 
            currentPage: result.currentPage, 
            totalPages: result.totalPages, 
            currentQuery: req.query, 
            title: 'Book page'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi Server");
    }
}


async function createBook(req, res, next) {
    try {
        const { categories, statuses } = await bookService.getBookMetadata();
        res.render('books/create', { 
            categories, 
            statuses, 
            error: null, 
            formData: {} 
        });
    } catch (err) { next(err); }
}

async function create(req, res, next) {
    try {
        const { error, value } = bookSchema.validate(req.body);
        if (error) {
            const { categories, statuses } = await bookService.getBookMetadata();
            return res.render('books/create', { 
                categories, 
                statuses, 
                error: error.details[0].message, 
                formData: req.body 
            });
        }

        await bookService.createBook(value, req.user._id);
        res.redirect('/books');
    } catch (err) { next(err); }
}


async function updateBook(req, res, next) {
    try {
        const [book, metadata] = await Promise.all([
            bookService.getBookById(req.params.id, req.user._id),
            bookService.getBookMetadata()
        ]);

        if (!book) {
            const err = new Error('Không tìm thấy sách hoặc không có quyền!');
            err.status = 404;
            return next(err); 
        }

        // Truyền đúng biến book (từ DB) ra EJS, KHÔNG dùng formData nữa
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
        const { error, value } = bookSchema.validate(req.body);
        
        if (error) {
            const { categories, statuses } = await bookService.getBookMetadata();
            
            // TUYỆT CHIÊU GỘP: Tạo object book chứa cả ID gốc và dữ liệu user vừa nhập sai
            const fakeBook = {
                _id: req.params.id,
                ...req.body
            };

            return res.render('books/update', {
                book: fakeBook, // Trả về fakeBook thay vì tách rời book và formData
                categories,
                statuses,
                error: error.details[0].message
            });
        }

        await bookService.updateBook(req.params.id, req.user._id, value);
        res.redirect('/books');
    } catch (err) { next(err); }
}

// delete book
async function deleteBook(req, res, next) {
    try {
        const deleteBook = await bookService.deleteBook(req.params.id, req.user._id);
        if(!deleteBook) {
            const err = new Error('Không tìm thấy sách!');
            err.status = 404;
            return next(err); 
        }

        res.redirect('/books');
    } catch (err) {
        next(err)
    }
}

// book detail
async function bookDetail(req, res) {
    try {
        // Truyền cả ID sách trên URL và ID của User xuống Service
        const book = await bookService.getBookById(req.params.id, req.user._id);
        
        if (!book) {
            return res.status(404).send("Không tìm thấy sách hoặc bạn không có quyền xem cuốn sách này");
        }
        
        res.render('books/detail', { book, title: 'Book detail' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi Server");
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
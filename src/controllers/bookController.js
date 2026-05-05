const bookService = require('../services/bookService');
const Book = require('../models/books'); // Giữ lại để dùng cho bookDetail

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

module.exports = { getAll, bookDetail };
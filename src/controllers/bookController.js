const Book = require('../models/books.js');

async function getAll(req, res) {
    try {
        // Ta có 3 bộ lọc nằm trong 1 trang nên phải có 1 object chứa ba cái 
        // điều kiện lọc đó
        let query = {};

        // Bộ lọc tìm kiếm
        if (req.query.q) {
            query.subject = {
                $regex: req.query.q,
                $options: 'i'
            }
        }

        // Bộ lọc danh mục
        if (req.query.category) {
            query.category_slug = req.query.category;
        }

        // Bộ lọc trạng thái
        if (req.query.status) {
            query.status_slug = req.query.status;
        }
        
        // Phân trang
        const page = parseInt(req.query.page) || 1;
        const perPage = 4;
        const skip = (page - 1) * perPage;

        // Truy vấn
        const books = await Book.find(query)
            .sort({ subject: -1})
            .skip(skip)
            .limit(perPage);
        
        // Tính số trang để đưa vào ejs vẽ ra số nút bấm cần thiết
        // Đếm tổng số bản ghi (document) đang có trong bảng(collection) books
        const totalItems = await Book.countDocuments(query);
        // Tính tổng số trang
        const totalPages = Math.ceil(totalItems / perPage);

        res.render('books/all', {books, currentPage: page, totalPages, currentQuery: req.query, title: 'Book page'});

    } catch (error) {
        res.status(500).send("Lỗi Server");
    }
}

async function bookDetail(req, res) {
    const bookId = req.params.id;
    const book = await Book.findOne({
        id: parseInt(bookId)
    })
    res.render('books/detail', {book, title: 'Book detail'})
}

module.exports = {
    getAll,
    bookDetail
};
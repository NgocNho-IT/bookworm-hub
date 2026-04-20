const Book = require('../models/books.js');

async function getAll(res, req) {
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

        //...còn nữa 

    } catch (err) {
        res.status(500).send("Lỗi Server");
    }
}

module.exports = {
    getAll,
};
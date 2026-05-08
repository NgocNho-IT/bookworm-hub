// controllers/siteController.js
const bookService = require('../services/bookService');

async function home(req, res) {
    try {
        // TRANG CHỦ: Duy nhất trang này truyền page và perPage để phân trang
        const options = { 
            page: parseInt(req.query.page) || 1, 
            perPage: 4 
        };
        const result = await bookService.getBooksAdvanced(req.user._id, options);
        
        res.render('sites/home', { 
            books: result.books,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            title: 'Home page' 
        });
    } catch (error) { 
        res.status(500).send("Lỗi Server"); 
    }
}

async function filterByCategory(req, res) {
    try {
        // LỌC THEO DANH MỤC: Không truyền page/perPage => Service sẽ lấy hết
        const options = { 
            categorySlug: req.params.cate 
        };
        const result = await bookService.getBooksAdvanced(req.user._id, options);
        
        res.render('sites/category', { 
            books: result.books, 
            title: 'Category page' 
        });
    } catch (error) { 
        res.status(500).send("Lỗi Server"); 
    }
}

async function filterByStatus(req, res) {
    try {
        // LỌC THEO TRẠNG THÁI: Hiển thị toàn bộ sách có trạng thái này[cite: 2]
        const options = { 
            statusSlug: req.params.stat 
        };
        const result = await bookService.getBooksAdvanced(req.user._id, options);
        
        res.render('sites/status', { 
            books: result.books, 
            title: 'Status page' 
        });
    } catch (error) { 
        res.status(500).send("Lỗi Server"); 
    }
}

async function search(req, res) {
    try {
        const keyword = req.query.q;
        if (!keyword) return res.redirect("/");
        
        // TÌM KIẾM: Hiện tại cũng sẽ hiển thị toàn bộ kết quả tìm được
        const options = { 
            search: keyword 
        };
        const result = await bookService.getBooksAdvanced(req.user._id, options);
        
        res.render('sites/search', { 
            books: result.books, 
            keyword, 
            title: 'Search page' 
        });
    } catch (error) { 
        res.status(500).send("Lỗi Server"); 
    }
}

async function about(req, res) {
    res.render('sites/about', { title: 'About page' });
}

module.exports = { 
    home, 
    filterByCategory, 
    filterByStatus, 
    about, 
    search 
};
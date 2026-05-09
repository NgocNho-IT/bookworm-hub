const bookService = require('../services/bookService');

async function home(req, res, next) {
    try {
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
    } catch (err) { 
        next(err);
    }
}

async function filterByCategory(req, res, next) {
    try {
        const options = { 
            categorySlug: req.params.cate 
        };
        const result = await bookService.getBooksAdvanced(req.user._id, options);
        
        res.render('sites/category', { 
            books: result.books, 
            title: 'Category page' 
        });
    } catch (err) { 
        next(err);
    }
}

async function filterByStatus(req, res, next) {
    try {
        const options = { 
            statusSlug: req.params.stat 
        };
        const result = await bookService.getBooksAdvanced(req.user._id, options);
        
        res.render('sites/status', { 
            books: result.books, 
            title: 'Status page' 
        });
    } catch (err) { 
        next(err)
    }
}

async function search(req, res) {
    try {
        const keyword = req.query.q;
        if (!keyword) return res.redirect("/");
        
        const options = { 
            search: keyword 
        };
        const result = await bookService.getBooksAdvanced(req.user._id, options);
        
        res.render('sites/search', { 
            books: result.books, 
            keyword, 
            title: 'Search page' 
        });
    } catch (err) { 
        next(err);
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
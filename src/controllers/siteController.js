const Book = require('../models/books.js')

async function home(req, res) {
    try{
        const page = parseInt(req.query.page) || 1;
        const perPage = 4;
        const skip = (page - 1) * perPage;

        const books = await Book.find()
            .sort({ subject: 1 })
            .skip(skip)
            .limit(perPage);

        const totalItems = await Book.countDocuments();
        const totalPages = Math.ceil(totalItems / perPage);

        res.render('sites/home', {books, currentPage: page, totalPages, title: 'Home page'})

    } catch (error) {
        res.status(500).send("Lỗi Server");
    }
}



async function filterByCategory(req, res) {
    const category = req.params.cate
    const books = await Book.find({
        category_slug: category
    })
    res.render('sites/category', {books, title: 'Category page'})
}

async function filterByStatus(req, res) {
    const status = req.params.stat
    const books = await Book.find({
        status_slug: status
    })
    res.render('sites/status', {books, title: 'Status page'})
}

async function about(req, res) {
    res.render('sites/about', {title: 'About page'})
}

async function search(req, res) {
    const keyword = req.query.q
    if (!keyword) {
        return res.redirect("/")
    }
    const books = await Book.find({
        subject: {
            $regex: keyword,
            $options: 'i'
        }
    })
    res.render('sites/search', {books, keyword, title: 'Search page'})
}

module.exports = {
    home,
    filterByCategory,
    filterByStatus,
    about,
    search
};
const Book = require('../models/books'); 
const Category = require('../models/categories');
const Status = require('../models/statuses');

async function getBooksAdvanced(userId, options = {}) {
    try {
        const { search, categorySlug, statusSlug, page, perPage } = options;
        let filter = { idUser: userId };

        if (search) {
            filter.subject = { $regex: search, $options: 'i' };
        }

        if (categorySlug) {
            const category = await Category.findOne({ slug: categorySlug });
            if (category) filter.idCategory = category._id;
        }

        if (statusSlug) {
            const status = await Status.findOne({ slug: statusSlug });
            if (status) filter.idStatus = status._id;
        }

        const totalItems = await Book.countDocuments(filter);

        let queryBuilder = Book.find(filter)
            .populate('idCategory', 'name slug')
            .populate('idStatus', 'name slug colorCode')
            .sort({ _id: -1 }); 

        const result = { totalItems };

        if (page && perPage) {
            const skip = (page - 1) * perPage;
            queryBuilder = queryBuilder.skip(skip).limit(perPage);
            
            result.currentPage = page;
            result.totalPages = Math.ceil(totalItems / perPage);
        }

        result.books = await queryBuilder;
        return result;

    } catch (err) {
        console.error("Lỗi getBooksAdvanced:", err.message);
        const error = new Error('Hệ thống đang bận. Vui lòng thử lại sau!');
        error.status = 500;
        throw error;
    }
}

// create book
async function createBook(bookData, userId) {
    try {
        const newBook = new Book({
        ...bookData,
        idUser: userId
    });
    
        return await newBook.save();
    } catch (err) {
        console.error("Lỗi createBook:", err.message);
        const error = new Error('Hệ thống đang bận. Vui lòng thử lại sau!');
        error.status = 500;
        throw error;
    }
    
}

// update book
async function updateBook(bookId, userId, updateData) {
    try {
        const updateBook = await Book.findOneAndUpdate(
            { _id: bookId, idUser: userId},
            updateData,
            { new: true }
        );
        return updateBook;

    } catch (err) {
        console.error("Lỗi updateBook:", err.message);
        const error = new Error('Hệ thống đang bận. Vui lòng thử lại sau!');
        error.status = 500;
        throw error;
    }
}

// delete book
async function deleteBook(bookId, userId) {
    try {
        const deleteBook = await Book.findOneAndDelete({
            _id: bookId,
            idUser: userId
        });
        return deleteBook;
    } catch (err) {
        console.error("Lỗi deleteBook:", err.message);
        const error = new Error('Hệ thống đang bận. Vui lòng thử lại sau!');
        error.status = 500;
        throw error;
    }
}

// get categories and statuses collection
async function getBookMetadata() {
try {
        const [categories, statuses] = await Promise.all([
            Category.find(),
            Status.find()
        ]);

        return { categories, statuses };
    } catch (err) {
        console.error("Lỗi getBookMetadata:", err.message);
        const error = new Error('Hệ thống đang bận. Vui lòng thử lại sau!');
        error.status = 500;
        throw error;
    }
}
// book detail
async function getBookById(bookId, userId) {
    const book = await Book.findOne({ _id: bookId, idUser: userId })
        .populate('idCategory', 'name slug')
        .populate('idStatus', 'name slug colorCode');
    if (!book) {
        const error = new Error("Sách này không tồn tại trong hệ thống!");
        error.status = 404;
        throw error;
    }
    return book;
    
}


module.exports = {
    getBooksAdvanced,
    getBookMetadata,
    createBook,
    updateBook,
    deleteBook,
    getBookById,
};
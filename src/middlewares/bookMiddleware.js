const { bookSchema } = require('../helpers/joi_helper');
const bookService = require('../services/bookService');

async function validateBook(req, res, next) {
    try {
        const { error, value } = bookSchema.validate(req.body);
        if (error) {
            const { categories, statuses } = await bookService.getBookMetadata();
            const isUpdate = req.path.includes('update');
            const viewPath = isUpdate? 'books/update' : 'books/create';

            return res.render(viewPath, {
                categories,
                statuses,
                error: error.details[0].message,
                book: { ...req.body, _id: req.params.id }
            })
        }
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    validateBook
};
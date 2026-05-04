// Middleware xử lý lỗi 404 - Not Found
function notFound(req, res, next) {
    res.status(404).render('errors/notFound');
}

// Midlleware xử lý lỗi chung
function errorHandler(err, req, res, next) {
    console.error(err.message);
    res.status(500).render('errors/errorHandler', {error: err.message});
}

module.exports = {
    notFound,
    errorHandler
};
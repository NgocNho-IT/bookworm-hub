// Middleware xử lý lỗi 404 - Not Found
function notFound(req, res, next) {
    res.status(404).render('errors/notFound');
}

// Midlleware xử lý lỗi chung
function errorHandler(err, req, res, next) {
    console.error("Chi tiết lỗi:", err.message);
    const statusCode = err.status || 500;
    const message = err.message || 'Đã xảy ra lỗi hệ thống';
    
    res.status(statusCode).render('errors/errorHandler', {
        statusCode: statusCode,
        message: message
    });
}

module.exports = {
    notFound,
    errorHandler
};
// Middleware xử lý lỗi 404 - Not Found
function notFound(req, res, next) {
    res.status(404).render('errors/notFound');
}

// Midlleware xử lý lỗi chung
function errorHandler(err, req, res, next) {
    // Log lỗi ra terminal để bạn (lập trình viên) biết đường fix
    console.error("Chi tiết lỗi:", err.message);

    // Lấy mã lỗi từ err (nếu có), nếu không có thì mặc định là 500 (Lỗi server)
    const statusCode = err.status || 500;
    
    // Gán thông báo lỗi phù hợp
    const message = err.message || 'Đã xảy ra lỗi hệ thống';

    // Trả về đúng 2 biến mà file EJS đang yêu cầu
    res.status(statusCode).render('errors/errorHandler', {
        statusCode: statusCode,
        message: message
    });
}

module.exports = {
    notFound,
    errorHandler
};
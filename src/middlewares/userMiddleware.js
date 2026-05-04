const { models } = require('mongoose');
const User = require('../models/users');

// Middleware kiểm tra authencation
async function requireAuth(req, res, next) {
    try {
        const sessionId = req.signedCookies.sessionId;

        if (!sessionId) {
            return res.redirect('/users/login');
        }

        // Tìm user theo sessionId
        const user = await User.findOne({sessionId: sessionId}).select('-password');
        if (!user) {
            return res.redirect('/users/login');
        }

        // Xác thực thành công từ đây
        // Gán user vào req để sử dụng trong các middleware tiếp theo
        req.user = user;
        next()

    } catch (err) {
        next(err);
    }
    
}

module.exports = {
    requireAuth,
};
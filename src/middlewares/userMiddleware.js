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

async function checkUser(req, res, next) {
    try {
        const sessionId = req.signedCookies.sessionId;
        if (sessionId) {
            const user = await User.findOne({sessionId: sessionId}).select('-password');
            if (user) {
                // Sử dụng biến toàn cục res.locals để dùng được ở mọi nơi
                res.locals.user = user;
            } else {
                res.locals.user = null;
            }
            
        } else {
            res.locals.user = null;
        }

        next();
    } catch (err) {
        next(err);
    }
    
}




module.exports = {
    requireAuth,
    checkUser
};
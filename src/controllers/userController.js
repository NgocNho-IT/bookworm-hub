const { createUserSchema, loginSchema } = require('../helpers/joi_helper');
const userService = require('../services/userService');

async function showRegister(req, res) {
    res.render('users/register', { error: null, formData: {} })
}

async function register(req, res) {
    try {
        await userService.registerUser(req.body);
        // Chuyển hướng tới trang đăng nhập với thông báo thành công
        res.redirect('/users/login?success=true');
    } catch (err) {
        res.render('users/register', {
            error: err.message,
            formData: req.body
        });
    }
}

// Hiển thị trang đăng nhập
async function showLogin(req, res) {
    const success = req.query.success === 'true' ? 'Đăng ký thành công! Vui lòng đăng nhập.' : null;
    res.render('users/login', { error: null, success: success, formData: {} });
}

// Xử lý đăng nhập
async function login(req, res, next) {
    try {
        const sessionId = await userService.loginUser(req.body.name, req.body.password);
        // Set cookie session
        res.cookie(
            'sessionId',
            sessionId,
            {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
                signed: true
            }
        );

        res.redirect('/');
    } catch (err) {
        res.render('users/login', {
            error: err.message,
            success: null,
            formData: req.body
        })
    }
}

// Xử lý đăng xuất
async function logout(req, res, next) {
    try {
        const sessionId = req.signedCookies.sessionId;
        await userService.logoutUser(sessionId);
        // Clear cookie
        res.clearCookie('sessionId');
        // Chuyển hướng đến trang đăng nhập
        res.redirect('/users/login');
    } catch (err) {
        next(err);
    }
}
module.exports = {
    showRegister,
    register,
    showLogin,
    login,
    logout
};
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/users.js');
const { createUserSchema, loginSchema } = require('../helpers/joi_helper');

async function showRegister(req, res) {
    res.render('users/register', { error: null, formData: {} })
}

async function register(req, res) {
    try {
        const {error, value} = createUserSchema.validate(req.body);
        if (error) {
            return res.render('users/register', {
                error: error.details[0].message,
                formData: req.body
            });
        }

        // Kiểm tra name đã tồn tại chưa
        const existingUser = await User.findOne({ name: value.name });
        if (existingUser) {
            return res.render('users/register', {
                error: 'Tên người dùng đã tồn tại',
                formData: req.body
            });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingEmail = await User.findOne({ email: value.email });
        if (existingEmail) {
            return res.render('users/register', {
                error: 'Email đã được sử dụng',
                formData: req.body
            });
        }

        // Mã hóa mật khẩu trước khi lưu vào database
        const hashedPassword = await bcrypt.hash(value.password, 10);

        // Tạo người dùng mới
        await User.insertOne({
            name: value.name,
            email: value.email,
            password: hashedPassword,
        });


        // Chuyển hướng tới trang đăng nhập với thông báo thành công
        res.redirect('/users/login?success=true');

    } catch (err) {
        res.render('users/register', {
            error: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
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
        // Validate
        const {error, value} = loginSchema.validate(req.body);
        if (error) {
            return res.render('users/login', {
                error: error.details[0].message,
                success: null,
                formData: req.body
            });
        }


        // Check user theo name
        const userData = await User.findOne({name: value.name});
        console.log(userData);
        if (!userData) {
            return res.render('users/login', {
                error: 'Sai tên người dùng',
                success: null,
                formData: req.body
            });
        }

        // Xác thực password
        const isPasswordValid = await bcrypt.compare(value.password, userData.password);
        if (!isPasswordValid) {
            return res.render('users/login', {
                error: 'Sai tên người dùng hoặc mật khẩu',
                success: null,
                formData: req.body
            });
        }

        // Tạo và lưu session id vào database
        const sessionId = crypto.randomBytes(16).toString('hex');
        await User.updateOne(
            { name: userData.name },
            { $set: { sessionId: sessionId } }
        );

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
        next(err);
    }
}

// Xử lý đăng xuất
async function logout(req, res) {
    try {
        const sessionId = req.signedCookies.sessionId;
        if (sessionId) {
            // Xóa session ID khỏi db
            await User.deleteOne(
                { sessionId: sessionId},
                { $set: {sessionId: null}}
            );

            // Clear cookie
            res.clearCookie('sessionId');

            // Chuyển hướng đến trang đăng nhập
            res.redirect('users/login');
        }
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
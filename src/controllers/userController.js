const bcrypt = require('bcrypt');
const User = require('../models/users.js');
const { createUserSchema } = require('../helpers/joi_helper');

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

module.exports = {
    showRegister,
    register,
    showLogin
};
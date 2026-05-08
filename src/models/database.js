require('dotenv').config();
const mongoose = require('mongoose');

// Kết nối MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Kết nối MongoDB thành công!');
        console.log(`Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('Lỗi kết nối MongoDB:', error.message);
    }
}

// Xử lý sự kiện connected
mongoose.connection.on('connected', () => {
    console.log('Mongoose đã kết nối tới MongoDB');
});

// Xử lý sự kiện error
mongoose.connection.on('error', (err) => {
    console.error('Mongoose lỗi kết nối:', err.message);
});

// Xử lý sự kiện disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose đã ngắt kết nối');
});

// // Đóng kết nối khi ứng dụng terminate (Ctrl+C)
// process.on('SIGINT', async () => {
//     await mongoose.connection.close();
//     console.log('Đã đóng kết nối MongoDB do app terminate');
// });

module.exports = connectDB;


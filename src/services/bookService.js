// services/bookService.js
const Book = require('../models/books'); 
const Category = require('../models/categories');
const Status = require('../models/statuses');

async function getBooksAdvanced(userId, options = {}) {
    try {
        // Rút trích các tham số từ options (KHÔNG set mặc định page/perPage ở đây)
        const { search, categorySlug, statusSlug, page, perPage } = options;

        // 1. Điều kiện mặc định: Chỉ lấy sách của user đang đăng nhập
        let filter = { idUser: userId };

        // 2. Tìm kiếm theo tiêu đề (Regex)
        if (search) {
            filter.subject = { $regex: search, $options: 'i' };
        }

        // 3. Lọc theo Category (Chuyển slug thành ObjectId)
        if (categorySlug) {
            const category = await Category.findOne({ slug: categorySlug });
            if (category) filter.idCategory = category._id;
        }

        // 4. Lọc theo Status (Chuyển slug thành ObjectId)
        if (statusSlug) {
            const status = await Status.findOne({ slug: statusSlug });
            if (status) filter.idStatus = status._id;
        }

        // Đếm tổng số bản ghi khớp với bộ lọc
        const totalItems = await Book.countDocuments(filter);

        // Khởi tạo truy vấn cơ bản (chưa có skip và limit)
        let queryBuilder = Book.find(filter)
            .populate('idCategory', 'name slug')
            .populate('idStatus', 'name slug colorCode')
            .sort({ _id: -1 }); // Dùng _id để tránh lỗi lặp sách khi phân trang

        // Khởi tạo object kết quả trả về
        const result = { totalItems };

        // 5. Logic chia nhánh: Nếu Controller có truyền page và perPage thì mới phân trang
        if (page && perPage) {
            const skip = (page - 1) * perPage;
            queryBuilder = queryBuilder.skip(skip).limit(perPage);
            
            result.currentPage = page;
            result.totalPages = Math.ceil(totalItems / perPage);
        }

        // 6. Thực thi truy vấn DB và gán vào mảng books
        result.books = await queryBuilder;

        // Trả về object chứa sách và các thông tin (nếu có)
        return result;

    } catch (error) {
        throw new Error("Lỗi ở Service Book: " + error.message);
    }
}


async function getBookById(bookId, userId) {
    try {
        // Tìm đúng ID sách VÀ đúng ID của người dùng đang đăng nhập
        const book = await Book.findOne({ _id: bookId, idUser: userId })
            .populate('idCategory', 'name slug')
            .populate('idStatus', 'name slug colorCode');
            
        return book;
    } catch (error) {
        throw new Error("Lỗi ở Service Book (getBookById): " + error.message);
    }
}


// Xuất hàm ra theo phong cách cũ
module.exports = {
    getBooksAdvanced,
    getBookById
};
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        id: { 
            type: Number, 
            required: true, 
            unique: true 
        },
        subject: { 
            type: String, 
            required: true,
            trim: true 
        },
        author: { 
            type: String, 
            required: true,
            trim: true
        },
        publication_year: { 
            type: Number,
            min: [1000, 'Năm xuất bản không hợp lệ'],
            max: [new Date().getFullYear(), 'Năm xuất bản không được lớn hơn năm hiện tại']
        },
        status: { 
            type: String, 
            required: true,
            enum: ['Đã xong', 'Đang đọc', 'Muốn mua'] 
        },
        status_slug: { 
            type: String, 
            required: true,
            enum: ['da-xong', 'dang-doc', 'muon-mua']
        },
        category: { 
            type: String, 
            required: true 
        },
        category_slug: { 
            type: String, 
            required: true 
        },
        image: { 
            type: String 
        },
        description: { 
            type: String 
        }
    },
    {
        timestamps: true,      
        collection: 'books'
    }
);


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
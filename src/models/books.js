const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
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
        idUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        idCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }, 
        idStatus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Status',
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
        collection: 'books',
        timestamps: true
        
    }
);


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
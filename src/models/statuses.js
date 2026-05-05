const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        colorCode: { 
            type: String, 
            default: 'primary' 
        }
    },
    {
        collection: 'statuses',
        timestamps: true

    }
);

const Status = mongoose.model('Status', statusSchema);

module.exports = Status;

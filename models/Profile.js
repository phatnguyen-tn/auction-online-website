const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    birthday: {
        type: Date,
        default: Date.now()
    },
    address: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('profile', ProfileSchema);
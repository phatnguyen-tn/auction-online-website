const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    roles: [
        {
            type: String,
            lowercase: true,
            enum: ['guess', 'bidder', 'seller', 'admin']
        }
    ]
})

module.exports = mongoose.model('user', UserSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    type: {
        type: String,
        lowercase: true,
        trim: true,
        enum: ['bidder', 'seller', 'admin'],
        default: 'bidder'
    },
    method: {
        type: String,
        enum: ['local', 'facebook', 'google'],
        trim: true,
        lowercase: true,
        default: 'local'
    },
    authId: String,
    secret: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    profile: {
        name: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: true
        },
        birthday: {
            type: Date,
            default: Date.now()
        },
        address: {
            type: String,
            trim: true
        }
    },
    wishlist: {
        type: [String]
    },
    isRequest: {
        type: Boolean,
        default: false
    },
    reviews: {
        type: {
            point: Number,
            turn: Array
        },
        default:{
            point: 100,
            turn: []
        }
    }
})

module.exports = mongoose.model('user', UserSchema);
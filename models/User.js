const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    type: {
        type: String,
        lowercase: true,
        enum: ['bidder', 'seller', 'admin'],
        default: 'bidder'
    },
    method: {
        type: String,
        enum: ['local', 'facebook', 'google', 'tweeter'],
        trim: true,
        lowercase: true,
        default: 'local'
    },
    local: {
        username: {
            type: String,
            lowercase: true,
            trim: true
        },
        password: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        profile: {
            avatar: {
                type: String,
                default: 'default_avt.jpg'
            },
            email: {
                type: String,
                trim: true,
                lowercase: true
            },
            name: {
                type: String,
                trim: true
            },
            birthday: {
                type: Date,
                default: Date.now()
            },
            address: String
        }
    },
    facebook: {
        id: {
            type: String
        },
        name: {
            type: String
        },
        email: {
            type: String,
            trim: true
        },
        avatar: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
    },
    google: {
        id: {
            type: String
        },
        name: {
            type: String
        },
        email: {
            type: String,
            trim: true
        },
        avatar: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
    }
})

module.exports = mongoose.model('user', UserSchema);
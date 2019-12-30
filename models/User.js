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
    role: {
        type: String,
        lowercase: true,
        enum: ['bidder', 'seller', 'admin']
    },
    profileId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'profile'
    },
    request: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('user', UserSchema);
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String
    },
    category: {
        type: Array
    },
    amount: {
        type: Number
    },
    seller: {
        type: String
    },
    sellDate: {
        type: Date,
        default: Date.now()
    },
    images: {
        type: Array
    },
    discription: {
        type: String
    },
    currentPrice: {
        type: Number,
        default: 10000
    },
    stepPrice: {
        type: Number
    },
    bestPrice: {
        type: Number
    },
    status: {
        type: String,
        default: 'bidding'
    }
});

module.exports = mongoose.model('product', ProductSchema, 'products');
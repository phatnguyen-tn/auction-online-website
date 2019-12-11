const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String
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
    imageLink: {
        type: String
    },
    currentPrice: {
        type: Number,
        default: 10000
    },
    bidder: {
        type: String
    }
});

module.exports = mongoose.model('product', ProductSchema, 'products');
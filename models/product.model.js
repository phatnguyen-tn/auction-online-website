const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String
    },
    category: {
        type: Array
    },
    seller: {
        type: String
    },
    sellDate: {
        type: String
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
    extend:{
        type: String,
        default: 'no'
    },
    status: {
        type: String,
        default: 'bidding'
    }
});

module.exports = mongoose.model('product', ProductSchema, 'products');
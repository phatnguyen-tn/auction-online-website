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
        type: Date
    },
    expDate:{
        type: Date
    },
    images: {
        type: Array
    },
    description: {
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
    topBidder:{
        type: String
    },
    extend:{
        type: String,
        default: 'no'
    },
    status: {
        type: String,
        default: 'bidding'
    },
    historyBidId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Historybid'
    },
    block:{
        type: [String],
        default: []
    }
});

var Product = mongoose.model('product', ProductSchema, 'products')

module.exports = Product;
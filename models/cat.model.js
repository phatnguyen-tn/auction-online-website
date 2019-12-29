const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
    name: {
        type: String
    },
    amount: {
        type: Number
    },
    child:{
        type: [String]
    },
    amountChild: {
        type: [Number]
    }
});

module.exports = mongoose.model('cat', CatSchema, 'categories');
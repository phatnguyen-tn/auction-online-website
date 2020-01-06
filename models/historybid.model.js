const mongoose = require('mongoose');

var historybidSchema = new mongoose.Schema({
    turn: {
        type: [{
            bidDate: String,
            username: String,
            price: Number
        }]
    }
});

var Historybid = mongoose.model('Historybid', historybidSchema, 'historybid');

module.exports = Historybid;
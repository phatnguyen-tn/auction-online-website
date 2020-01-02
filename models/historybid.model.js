const mongoose = require('mongoose');

var historybidSchema = new mongoose.Schema({
    turn: {
        type: [Object]
    }
});

var Historybid = mongoose.model('Historybid', historybidSchema, 'historybid');

module.exports = Historybid;
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const RemovalScheme = new Schema({
    ip: String,
    itemId: {
        type: String,
        unique: true
    },
    itemTitle: String,
    votes: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Removal', RemovalScheme);
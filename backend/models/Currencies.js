const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const CurrencySchema = new Schema({
    UAH: String,
    EUR: String,
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Currency', CurrencySchema);
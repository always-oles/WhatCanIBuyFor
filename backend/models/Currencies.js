const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const CurrencySchema = new Schema({
    UAH: String,
    EUR: String
});

module.exports = mongoose.model('Currency', CurrencySchema);
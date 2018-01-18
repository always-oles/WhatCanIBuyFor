const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const RequestSchema = new Schema({
    ip: String,
    product: String,
    price: Number
});

module.exports = mongoose.model('Request', RequestSchema);
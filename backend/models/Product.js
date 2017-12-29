const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const ProductSchema   = new Schema({
    title: String,
    price: Number,
    currency: String,
    picture: String,
    url: { 
        type: String, 
        index: { unique: true } 
    }
});

module.exports = mongoose.model('Product', ProductSchema);
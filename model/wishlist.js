const mongoose = require('mongoose');
const Product = require('./product');
const User = require('./user');

//  creating schema for wishlist objects refernces to user and product objects
const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
    ],
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
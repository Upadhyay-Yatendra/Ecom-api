const mongoose = require('mongoose');
const Product = require('./product');
const User = require('./user')

//  creating schema for cart objects refernces to user and product objects
const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required : true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
});

module.exports = mongoose.model('Cart',CartSchema);
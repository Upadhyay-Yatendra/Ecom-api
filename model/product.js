const mongoose = require('mongoose');
//  creating the schema for holding products
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 20
    },
    description: {
        type: String,
        required: true,
        min: 20,
        max: 100
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 100,
        max: 1000000
    }
});
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
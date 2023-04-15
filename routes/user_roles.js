// requiring all the needed modules

const router = require('express').Router();
const User = require('../model/user');
const Product = require('../model/product');
const verify = require('./verifyToken');
const Cart = require('../model/cart');
const Wishlist = require('../model/wishlist');
const verifySuspended = require('./verifySuspend');
const wishlist = require('../model/wishlist');

// creating route to view profile by the user
// middleware verifysuspended if the user is suspended
router.get("/ProfileView", verify, verifySuspended, (req, res) => {
    User.findOne({ _id: req.user })                   // req.user is populated in verify token module 
        .then(foundUser => {
            res.send(foundUser);
        })
        .catch(error => res.send(error))
});

// creating route for updation of user profile

router.patch("/ProfileUpdate", verify, verifySuspended, (req, res) => {
    User.updateOne(
        { _id: req.user },
        { $set: req.body }
    ).then(doc => {
        res.send(doc);
    })
        .catch(error => res.send(error));
});

// creating route for addition of a product to the user cart
router.post("/addToCart", verify, verifySuspended, async (req, res) => {


    const { productId, quantity } = req.body;
    const userId = req.user._id;            // req.user is populated in verify token module 

    try {
        // Find the product by ID
        const product = await Product.findById(productId);

        // If the product doesn't exist, return an error
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Create the cart object
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            // If the cart already exists, check if the product is already in it
            const productIndex = cart.products.findIndex(
                (productItem) => productItem.product == productId
            );
            if (productIndex !== -1) {
                // If the product already exists, update the quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // If the product doesn't exist, add it to the cart
                cart.products.push({
                    product: productId,
                    quantity: quantity,
                });
            }
            await cart.save();
            return res.json(cart);
        } else {
            // If the cart doesn't exist, create a new one
            const newCart = await Cart.create({
                user: userId,
                products: [{ product: productId, quantity: quantity }],
            });
            return res.json(newCart);
        }
    }//reurn the  errors in the adding process if any
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

});

// creating route for adding a product to the wishlist of a user

router.post("/addToWishlist", verify, verifySuspended, async (req, res) => {


    const { productId } = req.body;
    const userId = req.user._id;

    try {
        // Find the product by ID
        const product = await Product.findById(productId);

        // If the product doesn't exist, return an error
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Create the wishlist object
        const wishlist = await Wishlist.findOne({ user: userId });
        if (wishlist) {
            // If the Wishlist already exists, check if the product is already in it
            const productIndex = wishlist.products.findIndex(
                (productItem) => productItem.toString() === productId
            );
            if (productIndex !== -1) {
                // If the product already exists, throw the error
                return res.status(400).json({ error: 'Products already exists in the cart' });
            } else {
                // If the product doesn't exist, add it to the wishlist
                wishlist.products.push(productId);
            }
            await wishlist.save();
            return res.json(wishlist);
        } else {
            // If the Wishlist doesn't exist, create a new one
            const newWishlist = await Wishlist.create({
                user: userId,
                products: productId,
            });
            return res.json(newWishlist);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// creating route to search for a products by the name
router.get("/search", verify, verifySuspended, async (req, res) => {
    try {
        const productName = req.body.productName;
        const products = await Product.find({ name: { $regex: productName, $options: 'i' } });          // flaf 'i' has been added to avoid case sensitivity
        // if no products are found then throw this message
        if (products.length == 0) {
            res.send('No product found');
        }
        // if products are found display them
        res.json({ message: 'Search Results :', products: products });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error finding products', error: err });
    }
});

//  creating route to filter products and show them based on a price range

router.get("/filter", verify, verifySuspended, async (req, res) => {
    try {
        const min = req.body.min;
        const max = req.body.max;
        const products = await Product.find({ price: { $gte: min, $lte: max } })
        if (products.length === 0) res.send('NO PRODUCTS FOUND');
        res.json({ message: 'Search Results :', products: products });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error finding products', error: err });
    }
});
module.exports = router;
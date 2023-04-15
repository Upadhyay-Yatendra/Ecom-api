// requirung all necessary modules
const router = require('express').Router();
const User = require('../model/user');
const Product = require('../model/product');
const verify = require('./verifyToken');
const { productValidation } = require('../validation');

//  creating route to handle a new product addition to the database

router.post("/create", verify, async (req, res) => {
    // these try and catch blocks are to verify if this user is an admin or not 
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.admin) {
            return res.status(400).send("You are not an admin - Access denied");
        }
    } catch (error) {
        console.error(error);
    }
    // this is the actual route handler code
    try {

        // USING JOI OBJECT HERE TO VALIDATE
        const { error } = productValidation(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const { name, price, description, image } = req.body;

        const product = new Product({
            name,
            price,
            description,
            image,
        });

        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//  creating route to update some or few properties of instance of product collection 

router.patch("/update/:productId", verify, async (req, res) => {

    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.admin) {
            return res.status(400).send("You are not an admin - Access denied");
        }
    } catch (error) {
        console.error(error);
    }

    // updating a single product based on given id
    Product.updateOne(
        { _id: req.params.productId },
        { $set: req.body }
    ).then(doc => {
        res.send("UPDATED :\n" + JSON.stringify(doc));
    })
        .catch(error => res.send(error));
});

// creating route to delete a product from products collection

router.delete("/delete/:productId", verify, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.admin) {
            return res.status(400).send("You are not an admin - Access denied");
        }
    } catch (error) {
        console.error(error);
    }
    Product.findByIdAndDelete(req.params.productId)
        .then((doc) => {
            res.send('Deleted product:' + JSON.stringify(doc));
        })
        .catch(error => res.send(error))

});


//  creating a route to suspend a user 

router.patch("/suspend/:userId", verify, async (req, res) => {

    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.admin) {
            return res.status(400).send("You are not an admin - Access denied");
        }
    } catch (error) {
        console.error(error);
    }
    //  suspending the user by setting suspended to true with a reason
    User.updateOne(
        { _id: req.params.userId },
        { $set: { suspended: true, reason: req.body.reason } }
    ).then(doc => {
        res.send("suspended user : " + Json.stringify(doc));
    })
        .catch(error => res.send(error));

})
module.exports = router;



//  this is the authorization file , it contains modules for authorizing the user

const router = require('express').Router();
const User = require('../model/user')
//  requiring bcrypt for hashing the user password

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
// VALIDATNG THE USER OBJECT FOR IT'S PROPOERTIES


router.post('/register', async (req, res) => {

    // USING JOI OBJECT HERE TO VALIDATE
    const { error } = registerValidation(req.body);
    // res.send(error.details[0].message);
    if (error) return res.status(400).send(error.details[0].message);

    // before saving  user let us check for no duplicate emails

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already Exists');

    // NOW WE WILL HASH THE PASSWORD FOR SECURTY PURPOSES
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        admin: req.body.admin
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    }
    catch (err) {
        res.status(400).send(err);
    }

    // res.send('Registered');
});


router.post('/login', async (req, res) => {
    // 1st let's validate the details entered
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // let's check if the user even exists or not 
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('User does not exists');
    }
    if (user.suspended) {
        return res.status(400).send('This user has been suspended');
    }
    // let's check for the password now
    const correctPass = await bcrypt.compare(req.body.password, user.password)
    console.log("\n\n\n " + correctPass);
    if (!correctPass) {
        res.status(400).send('Wrong password');
    }

    // create a jwt token and assign it to the user when logged in
    const token = jwt.sign({ _id: user._id }, process.env.SECRET)
    res.header('authToken', token).send(token);
    // res.send('Logged in');
})

module.exports = router;
const mongoose = require('mongoose');

//  creating schema for user objects 
const userSchema = new mongoose.Schema({
    //  the variable admin is to check if this user is has admin rights or not 
    admin: {
        type: Boolean,
        default: false,
    },
    // creating a variable suspended to keep track of whether user is suspended or not 
    suspended: {
        type: Boolean,
        default: false
    },
    //  reason is the reason for suspension of user
    reason: {
        type: String,
        min:3
    },
    name: {
        type: String,
        required: true,
        min: 5,
        max: 20
    },
    email: {
        type: String,
        required: true,
        min: 11,
        max: 100
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
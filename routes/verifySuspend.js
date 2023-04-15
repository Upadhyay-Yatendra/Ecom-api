//  this module is to verify if a user is suspended or not 

const User = require('../model/user');

module.exports = async function (req, res, next) {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        //  in case is user if found checking for it's suspension
        if (!user.suspended) {
            next();
        } else {
            res.status(403).send('Your account has been suspended. Please contact support for more information.');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Failed to check for suspension');
    }
}

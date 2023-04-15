const jwt = require('jsonwebtoken');
// crating an external module to verify the jwt token held by the user for authentication
module.exports = function(req,res,next){
    const token = req.header('authToken');
    //  if  request  does not have a token 
    if(!token){
        return res.status(401).send('Access Denied');
    }
    try{
        const verified = jwt.verify(token,process.env.SECRET);
        req.user = verified;            // populating req.user with results of jwt verfication
        next();
    }
    catch(error){
            res.status(400).send('Invalid Token')
    }
};
//  requiring all necessary external modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config()
const app = express();
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user_roles');
const adminRoute = require('./routes/admin_roles');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.use('/api/user',authRoute);
app.use('/api/user_roles',userRoute);
app.use('/api/admin_roles',adminRoute);

// connecting to mongodb atlas

mongoose.connect(`mongodb+srv://yupadhyayyk:${process.env.PASSWORD}@cluster0.uzfrrrm.mongodb.net/TaskDB`)
    .then(() => console.log("CONNECTED TO DATABASE"))
    .catch(error => { console.log(error); })

app.get("/",function(req,res){
    res.send('Check github repo for route information');
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});

const mongoose = require('mongoose');

mongoose.connect("mongodb://0.0.0.0:27017/expressDelivery").then(console.log("Connected to server"))
.catch((e)=> console.log(`Not Connected -- ${e}`));
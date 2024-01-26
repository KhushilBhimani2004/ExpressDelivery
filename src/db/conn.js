const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://chinmayrmhatre:97M9OZOJRJDOh1kM@expressdelivery.zr6wdfo.mongodb.net/expressDelivery?retryWrites=true&w=majority").then(console.log("Connected to server"))
.catch((e)=> console.log(`Not Connected -- ${e}`));
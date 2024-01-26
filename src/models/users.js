const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
    "name": String,
    "email": String,
    "password": String,
    "conPassword": String
})

// Collection
const userData = new mongoose.model("user",userSchema);

module.exports = userData;
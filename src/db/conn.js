const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL).then(console.log("Connected to server"))
.catch((e)=> console.log(`Not Connected -- ${e}`));
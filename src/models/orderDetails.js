const mongoose = require('mongoose');

const details_Schema  = new mongoose.Schema({
    'user': String,
    'deliveryType': String,
    'weightSelected': String,
    'pickup_location': String,
    'pickupPerson_Name': String,
    'pickupPerson_MobNo': String,
    'pickup_address': String,
    'drop_location': String,
    'dropPerson_Name': String,
    'dropPerson_MobNo': String,
    'drop_address': String,
    'selectedItems': [String],
    'payTypeSelected': String,
    'status': String
  })

// Collection
const details_Data = new mongoose.model("details",details_Schema);

module.exports = details_Data;  
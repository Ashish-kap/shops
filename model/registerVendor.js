const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactInformation: {
      type: String,
      required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
  shopId:{
    type: String,
    required: true,
  }
});

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;

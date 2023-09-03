const mongoose = require('mongoose');
const vendorExpenseSchema = new mongoose.Schema({
  productName:{
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100, 
    trim: true, 
  },
  description: {
    type: String,
    maxlength: 500, 
    trim: true, 
  },
  quantity: {
    type: String,
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now, 
    required: true,
    validate: {
      validator: function (value) {
        // Custom validator to check if the date is not in the future
        return value = new Date();
      },
      message: 'Date cannot be in the future',
    },
  },
  amount: {
    type: Number,
    // required: true,
    min: 0, 
  },
  paymentDueDate: {
    type: Date,
    // validate: {
    //   validator: function (value) {
    //     // Custom validator to check if the payment due date is not in the past
    //     return value >= new Date();
    //   },
    //   message: 'Payment due date cannot be in the past',
    // },
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partially Paid'],
    default: 'Unpaid',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  shopId:{
    type: String,
    required: true,
  },
   vendorId:{
    type: String,
    required: true,
  }
});

const VendorExpense = mongoose.model('VendorExpense', vendorExpenseSchema);
module.exports = VendorExpense;

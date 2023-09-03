const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validator to check if the date is not in the future
        return value = new Date();
      },
      message: 'Date cannot be in the future',
    },
  },
  description: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  incomeSource:{
    type: String,
  },
  ProductSoldQuantity:{
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  shopId:{
    type: String,
    required: true,
  }
});

const Income = mongoose.model('Income', incomeSchema);
module.exports = Income;

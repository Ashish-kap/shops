const mongoose = require('mongoose');

const basicExpenseSchema = new mongoose.Schema({
  expenseName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
    trim: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  forWhichEmployee:{
    type: String,
    maxlength: 500,
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

const BasicExpense = mongoose.model('BasicExpense', basicExpenseSchema);
module.exports = BasicExpense;
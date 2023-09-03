const mongoose = require('mongoose');
const basicExpenseSchema = new mongoose.Schema({
  expenseName: {
    type: String,
    required: true,
    minlength: 2, 
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
  shopId:{
    type: String,
    required: true,
  }
});

const BasicExpense = mongoose.model('BasicExpense', basicExpenseSchema);
module.exports = BasicExpense;
const mongoose = require('mongoose');

const employeeSalarySchema = new mongoose.Schema({
  salaryAmount: {
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
  paymentMethod: {
    type: String,
    // required: true,
    // enum: ['Cash', 'Bank Transfer', 'Check', 'Other'], 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  shopId:{
    type: String,
    required: true,
  },
  employeeId:{
    type: String,
    required: true,
  }
});

const EmployeeSalary = mongoose.model('EmployeeSalary', employeeSalarySchema);

module.exports = EmployeeSalary;

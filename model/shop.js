const mongoose = require('mongoose');
const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2, 
    maxlength: 100, 
    trim: true, 
    validate: {
      validator: function (value) {
        // Custom validator to check if the name contains only letters and spaces
        return /^[A-Za-z\s]+$/.test(value);
      },
      message: 'Name should contain only letters and spaces',
    },
  },
  address: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 200, 
    trim: true, 
  },
  contactInformation: {
    type: String,
    required: true,
  },
  VendorExpense: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorExpense'
  }],
  EmployeeSalary: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmployeeSalary'
  }],
  BasicExpense: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BasicExpense'
  }],
  Income: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Income'
  }],
  
  
});



const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;

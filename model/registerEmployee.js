const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
   balanced: {
    type: Number,
    default: 0
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  shopId:{
    type: String,
    required: true,
  }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;

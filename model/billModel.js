const mongoose = require('mongoose');

const billModalSchema = new mongoose.Schema({
  BillNumber: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    required: true,
  },
});
const BillModal = mongoose.model('billModal', billModalSchema);
module.exports = BillModal;
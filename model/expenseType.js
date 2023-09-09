const mongoose = require('mongoose');

// Define the schema
const itemSchema = new mongoose.Schema({
  expenseTypes: [
    {
      name: String,
    },
  ],
});

// Create a model
const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
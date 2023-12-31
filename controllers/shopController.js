const BasicExpense = require('../model/basicExpense.js');
const Income = require('../model/income.js');
const Shop = require('./../model/shop');
const VendorExpense = require('../model/vendor.js');
const EmployeeSalary = require('../model/employee.js');

const Employee = require('../model/registerEmployee.js');
const Vendor = require('../model/registerVendor.js');

exports.allShops = async (req, res) => {
  try {
    const user = req.userr
    const shops = await Shop.find({userId:user._id});
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST endpoint for creating a new shop
exports.createShop = async (req, res) => {
  try {

    const user = req.userr
    const { name, address, contactInformation } = req.body;

    // Create a new shop document using the Shop model
    const newShop = new Shop({
      name,
      address,
      contactInformation,
      userId:user._id
    });

    // Save the new shop to the database
    const savedShop = await newShop.save();
    res.status(201).json({
      status:"success",
      savedShop
    });

  } catch (error) {
    res.status(500).json({
       error: 'Failed to save the shop',
       message:error.message
       });
  }
};


exports.updateShop = async (req, res) => {
  try {
    const shopId = req.params.id;
    const updates = req.body;
    // Find the shop by its ID and update it with the new data
    const result = await Shop.updateOne({ _id: shopId }, updates);
    if (result.n === 0) {
      res.status(404).json({ error: 'Shop not found' });
    } else if (result.nModified === 0) {
      res.status(200).json({ 
        message: 'No changes were made'
       });
    } else {
      res.status(200).json({ message: 'Shop updated successfully' });
    }
  } catch (error) {
    console.error('Error updating shop:', error);
    res.status(500).json({ error: 'Failed to update the shop' });
  }
};


exports.deleteShop =  async (req, res) => {
  const shopId = req.params.shopId;
  try {
    // Attempt to find the shop by its ID and delete it
    const deletedShop = await Shop.findByIdAndDelete(shopId);
  

    if (!deletedShop) {
      return res.status(404).json({ 
        message: 'Shop not found'
       });
    }

    await BasicExpense.deleteMany({shopId});
    await EmployeeSalary.deleteMany({shopId});
    await Income.deleteMany({shopId});
    await Employee.deleteMany({shopId});
    await Vendor.deleteMany({shopId});
    await VendorExpense.deleteMany({shopId});

    return res.status(200).json({status:"success",message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

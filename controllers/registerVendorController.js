const Vendor = require('../model/registerVendor.js');
const VendorExpense = require('../model/vendor.js');
const Shop = require('../model/shop.js'); 

exports.registerVendor = async (req, res) => {
  try {
    const user = req.userr
    const { vendorName, address, contactInformation } = req.body;

    // Create a new vendor document
    const vendor = new Vendor({
      vendorName,
      address,
      contactInformation,
      userId:user._id
    });

    // Save the vendor to the database
    await vendor.save();

    res.status(201).json({
        status:"success",
        vendor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        message:error.message,
        error: 'Internal server error'
     });
  }
};


exports.getRegisterVendors = async (req, res) => {
  try {
    const user = req.userr
    const vendors = await Vendor.find({userId:user._id });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.deleteVendor =  async (req, res) => {
  const vendorId = req.params.vendorId;
  try {
    // Attempt to find the vendor by its ID and delete it
    const deletedvendor = await Vendor.findByIdAndDelete(vendorId);

    if (!deletedvendor) {
      return res.status(404).json({ 
        message: 'vendor not found'
       });
    }

    await VendorExpense.deleteMany({vendorId});

    return res.status(200).json({status:"success",message: 'vendor deleted successfully' });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
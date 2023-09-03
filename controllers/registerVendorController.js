const Vendor = require('../model/registerVendor.js');
const Shop = require('../model/shop.js'); 

exports.registerVendor = async (req, res) => {
  try {
    const shopId = req.params.shopId
    const { vendorName, address, contactInformation } = req.body;

    // Create a new vendor document
    const vendor = new Vendor({
      vendorName,
      address,
      contactInformation,
      shopId
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
    const shopId = req.params.shopId
    const vendors = await Vendor.find({ shopId });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

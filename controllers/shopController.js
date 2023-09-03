const Shop = require('./../model/shop');

exports.allShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST endpoint for creating a new shop
exports.createShop = async (req, res) => {
  try {
    const { name, address, contactInformation } = req.body;

    // Create a new shop document using the Shop model
    const newShop = new Shop({
      name,
      address,
      contactInformation,
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


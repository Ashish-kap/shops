const createDbConnection = require('./db'); 
const connection = createDbConnection();

// exports.allShops = async (req, res) => {
//   try {
//     const user = req.userr
//     const shops = await Shop.find({userId:user._id});
//     res.json(shops);
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// POST endpoint for creating a new shop
// exports.createShop = async (req, res) => {
//   try {
//     const user = req.userr
//     const { name, address, contactInformation } = req.body;
//     // Create a new shop document using the Shop model
//     const newShop = new Shop({
//       name,
//       address,
//       contactInformation,
//       userId:user._id
//     });

//     // Save the new shop to the database
//     const savedShop = await newShop.save();
//     res.status(201).json({
//       status:"success",
//       savedShop
//     });

//   } catch (error) {
//     res.status(500).json({
//        error: 'Failed to save the shop',
//        message:error.message
//        });
//   }
// };


exports.allShops = async (req, res) => {
  try {
    const user = req.userr;
    
    const findShopsQuery = `
      SELECT * FROM shops
      WHERE userId = ?
    `;
    
    connection.query(findShopsQuery, [user.id], (error, results) => {
      if (error) {
        res.status(500).json({
          error: 'Internal server error',
          message: error.message,
        });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};


exports.createShop = async(req, res) => {
  try {
    const user = req.userr;
    const { name, address, contactInformation } = req.body;

    console.log("here is user:", JSON.stringify(user))

    const createShopQuery = `
      INSERT INTO shops (name, address, contactInformation, userId)
      VALUES (?, ?, ?, ?)
    `;

    connection.query(
      createShopQuery,
      [name, address, contactInformation, user.id],
      (error, results) => {
        if (error) {
          res.status(500).json({
            error: 'Failed to save the shop',
            message: error.message,
          });
        } else {
          res.status(201).json({
            status: 'success',
            savedShop: {
              id: results.insertId, // The ID of the newly inserted row
              name,
              address,
              contactInformation,
              userId: user._id,
            },
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      error: 'Failed to save the shop',
      message: error.message,
    });
  }
};


// exports.updateShop = async (req, res) => {
//   try {
//     const shopId = req.params.id;
//     const updates = req.body;
//     // Find the shop by its ID and update it with the new data
//     const result = await Shop.updateOne({ _id: shopId }, updates);
//     if (result.n === 0) {
//       res.status(404).json({ error: 'Shop not found' });
//     } else if (result.nModified === 0) {
//       res.status(200).json({ 
//         message: 'No changes were made'
//        });
//     } else {
//       res.status(200).json({ message: 'Shop updated successfully' });
//     }
//   } catch (error) {
//     console.error('Error updating shop:', error);
//     res.status(500).json({ error: 'Failed to update the shop' });
//   }
// };



// exports.deleteShop =  async (req, res) => {
//   const shopId = req.params.shopId;
//   try {
//     // Attempt to find the shop by its ID and delete it
//     const deletedShop = await Shop.findByIdAndDelete(shopId);
  

//     if (!deletedShop) {
//       return res.status(404).json({ 
//         message: 'Shop not found'
//        });
//     }

//     await BasicExpense.deleteMany({shopId});
//     await EmployeeSalary.deleteMany({shopId});
//     await Income.deleteMany({shopId});
//     await Employee.deleteMany({shopId});
//     await Vendor.deleteMany({shopId});
//     await VendorExpense.deleteMany({shopId});

//     return res.status(200).json({status:"success",message: 'Shop deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting shop:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


exports.deleteShop = async (req, res) => {
  const shopId = req.params.shopId;
  try {
    // Attempt to find the shop by its ID and delete it
    const findShopQuery = 'SELECT userId FROM shops WHERE id = ?';
    connection.query(findShopQuery, [shopId], async (error, results) => {
      if (error) {
        return res.status(500).json({
          error: 'Internal server error',
          message: error.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status: 'failed',
          message: 'Shop not found',
        });
      }

      const userId = results[0].userId;

      // Check if the user has permission to delete the shop
      if (userId !== req.userr.id) {
        return res.status(403).json({
          status: 'failed',
          message: 'You do not have permission to delete this shop',
        });
      }

      // Delete shop and related data
      const deleteShopQuery = 'DELETE FROM shops WHERE id = ?';
      connection.query(deleteShopQuery, [shopId], async (error, deleteResults) => {
        if (error) {
          return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
          });
        }

        const affectedRows = deleteResults.affectedRows;

        if (affectedRows === 0) {
          return res.status(404).json({
            status: 'failed',
            message: 'Shop not found',
          });
        }

        // Delete related data in other tables
        const deleteRelatedDataQuery = `
          DELETE FROM basic_expenses WHERE shopId = ?;
          DELETE FROM employee_salaries WHERE shopId = ?;
          DELETE FROM incomes WHERE shopId = ?;
          DELETE FROM employees WHERE shopId = ?;
          DELETE FROM vendors WHERE shopId = ?;
          DELETE FROM vendor_expenses WHERE shopId = ?;
        `;
        connection.query(deleteRelatedDataQuery, [shopId, shopId, shopId, shopId, shopId, shopId], (error) => {
          if (error) {
            console.error('Error deleting related data:', error);
            return res.status(500).json({ message: 'Internal server error' });
          }

          return res.status(200).json({ status: 'success', message: 'Shop and related data deleted successfully' });
        });
      });
    });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createDbConnection = require('./db'); 
const connection = createDbConnection();

// exports.registerVendor = async (req, res) => {
//   try {
//     const user = req.userr
//     const { vendorName, address, contactInformation } = req.body;

//     // Create a new vendor document
//     const vendor = new Vendor({
//       vendorName,
//       address,
//       contactInformation,
//       userId:user._id
//     });

//     await vendor.save();

//     res.status(201).json({
//         status:"success",
//         vendor
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ 
//         message:error.message,
//         error: 'Internal server error'
//      });
//   }
// };


exports.registerVendor = async (req, res) => {
  try {
    const user = req.userr;
    const { vendorName, address, contactInformation } = req.body;

    // Create a new vendor document
    const createVendorQuery = `
      INSERT INTO vendor (vendorName, address, contactInformation, userId)
      VALUES (?, ?, ?, ?)
    `;

    connection.query(
      createVendorQuery,
      [vendorName, address, contactInformation, user.id],
      (error, results) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        res.status(201).json({
          status: 'success',
          vendor: {
            id: results.insertId,
            vendorName,
            address,
            contactInformation,
            userId: user.id,
          },
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      error: 'Internal server error',
    });
  }
};


// exports.getRegisterVendors = async (req, res) => {
//   try {
//     const user = req.userr
//     const vendors = await Vendor.find({userId:user._id });
//     res.json(vendors);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.getRegisterVendors = async (req, res) => {
  try {
    const user = req.userr;

    // Retrieve vendors for the user from the 'vendor' table
    const getVendorsQuery = `
      SELECT * FROM vendor
      WHERE userId = ?
    `;

    connection.query(getVendorsQuery, [user.id], (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// exports.deleteVendor =  async (req, res) => {
//   const vendorId = req.params.vendorId;
//   try {
//     // Attempt to find the vendor by its ID and delete it
//     const deletedvendor = await Vendor.findByIdAndDelete(vendorId);

//     if (!deletedvendor) {
//       return res.status(404).json({ 
//         message: 'vendor not found'
//        });
//     }

//     await VendorExpense.deleteMany({vendorId});

//     return res.status(200).json({status:"success",message: 'vendor deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting shop:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


exports.deleteVendor = async (req, res) => {
  const vendorId = req.params.vendorId;
  try {
    // Attempt to find the vendor by its ID and delete it
    const deleteVendorQuery = `
      DELETE FROM vendor
      WHERE id = ?
    `;

    connection.query(deleteVendorQuery, [vendorId], (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ 
          message: 'Vendor not found'
         });
      }

      // Assuming you have a VendorExpense table, delete related records here
      const deleteVendorExpenseQuery = `
        DELETE FROM vendor_expense
        WHERE vendorId = ?
      `;

      connection.query(deleteVendorExpenseQuery, [vendorId], (error) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        res.status(200).json({ status: 'success', message: 'Vendor deleted successfully' });
      });
    });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

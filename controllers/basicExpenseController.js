const createDbConnection = require('./db'); 
const connection = createDbConnection();

// Endpoint to add new basic expenses
// exports.createBasicExpense = async (req, res) => {
//   try {
//     const shopId = req.params.shopId;
//     const user = req.userr;
//     const {
//       date,
//       description,
//       forWhichEmployee,
//       amountsAndNames,
//     } = req.body;

//     const shop = await Shop.findById(shopId);
//     if (!shop) {
//       return res.status(404).json({ error: 'Shop not found' });
//     }

//     const savedBasicExpenses = [];
//     for (const { amount, expenseName } of amountsAndNames) {
//       const newBasicExpense = new BasicExpense({
//         expenseName,
//         amount,
//         date,
//         description,
//         shopId,
//         forWhichEmployee,
//         userId: user._id,
//       });

//       const savedExpense = await newBasicExpense.save();
//       savedBasicExpenses.push(savedExpense._id);

//       shop.BasicExpense.push(savedExpense._id);
//     }

//     await shop.save();

//     res.status(201).json({
//       status: 'success',
//       savedBasicExpenses,
//     });
//   } catch (err) {
//     res.status(400).json({
//       error: err.message,
//       message: err.message,
//     });
//   }
// };

exports.createBasicExpense = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const user = req.userr;
    const {
      date,
      description,
      forWhichEmployee,
      amountsAndNames,
    } = req.body;

    // Check if the shop exists
    const findShopQuery = 'SELECT userId FROM shops WHERE id = ?';
    connection.query(findShopQuery, [shopId], async (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database shop error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Shop not found' });
      }

      const shop = results[0];
      const userId = shop.userId;

      // Check if the user has permission to create an expense for the shop
      if (userId !== user.id) {
        return res.status(403).json({
          status: 'failed',
          message: 'You do not have permission to create expenses for this shop',
        });
      }

      // Construct values array for inserting multiple rows
      const values = amountsAndNames.map(({ amount, expenseName }) => [
        expenseName,
        amount,
        date,
        description,
        forWhichEmployee,
        user.id,
        shopId,
      ]);

      // Insert multiple rows into the basic_expenses table with a single query
      const insertBasicExpenseQuery = `
        INSERT INTO basic_expenses (expenseName, amount, date, description, forWhichEmployee, userId, shopId)
        VALUES ?;
      `;

      connection.query(insertBasicExpenseQuery, [values], async (error, results) => {
        if (error) {
          console.log(error)
          return res.status(500).json({
            status: 'error',
            message: 'Database basic error. Please try again later.',
          });
        }

        const insertId = results.insertId; // Get the insertId

        // Update the shop to link to the saved expenses
        const updateShopQuery = 'UPDATE shops SET updatedAt = CURRENT_TIMESTAMP() WHERE id = ?';
        connection.query(updateShopQuery, [shopId], (error) => {
          if (error) {
            console.error('Error updating shop:', error);
          }

          res.status(201).json({
            status: 'success',
            savedBasicExpenses: [insertId], // Return the insertId
          });
        });
      });
    });
  } catch (error) {
    console.error('Error creating basic expense:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};


// Get Expense type
// exports.getAllExpenseTypes = async (req, res) => {
//   try {
//     // Find the document containing the expense types
//     const user = req.userr
//     const item = await Item.findOne({userId:user._id});

//     if (!item || !item.expenseTypes || item.expenseTypes.length === 0) {
//       return res.status(404).json({ message: 'Expense types not found' });
//     }

//     // Extract the expense types from the document
//     const expenseTypes = item.expenseTypes.map((expenseType) => expenseType);

//     return res.status(200).json({ expenseTypes });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


exports.getAllExpenseTypes = async (req, res) => {
  try {
    // Get the user and userId
    const user = req.userr;
    const userId = user.id;

    // Query the database to find the user's item and associated expense types
    const findItemQuery = 'SELECT id FROM item WHERE userId = ?';
    connection.query(findItemQuery, [userId], async (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Expense types not found' });
      }

      const itemId = results[0].id;

      // Query the expense_type table to fetch all expense types for the user's item
      const findExpenseTypesQuery = 'SELECT id, name FROM expense_type WHERE itemId = ?';
      connection.query(findExpenseTypesQuery, [itemId], (error, results) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        const expenseTypes = results.map((result) => ({ id: result.id, name: result.name }));

        return res.status(200).json({ expenseTypes });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// exports.addExpenseType = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const user = req.userr

//     if (!name) {
//       return res.status(400).json({ message: 'Expense Type name is required' });
//     }

//     // Find the existing document or create a new one if it doesn't exist
//     let item = await Item.findOne({userId:user._id});

//     if (!item) {
//       item = new Item({ expenseTypes: [],userId:user._id });
//     }

//     // Check if the expense type with the same name already exists
//     const existingExpenseType = item.expenseTypes.find(
//       (expenseType) => expenseType.name === name
//     );

//     if (existingExpenseType) {
//       return res.status(400).json({ message: 'Expense Type already exists' });
//     }

//     // Add the new expense type to the array
//     item.expenseTypes.push({ name });

//     // Save the updated document
//     await item.save();

//     return res.status(201).json({ 
//       status:"success",
//       message: 'ExpenseType added successfully',
//       item 
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


exports.addExpenseType = async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.userr;

    if (!name) {
      return res.status(400).json({ message: 'Expense Type name is required' });
    }

    // Find the existing item for the user or create a new one if it doesn't exist
    const findItemQuery = 'SELECT id FROM item WHERE userId = ?';
    connection.query(findItemQuery, [user.id], async (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      let itemId;

      if (results.length > 0) {
        itemId = results[0].id;
      } else {
        const createItemQuery = 'INSERT INTO item (userId) VALUES (?)';
        connection.query(createItemQuery, [user.id], (error, result) => {
          if (error) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error. Please try again later.',
            });
          }
          itemId = result.insertId;
        });
      }

      // Check if the expense type with the same name already exists
      const findExpenseTypeQuery = 'SELECT id FROM expense_type WHERE name = ? AND itemId = ?';
      connection.query(findExpenseTypeQuery, [name, itemId], async (error, results) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        if (results.length > 0) {
          return res.status(400).json({ message: 'Expense Type already exists' });
        }

        // Insert the new expense type into the database
        const insertExpenseTypeQuery = 'INSERT INTO expense_type (name, itemId) VALUES (?, ?)';
        connection.query(insertExpenseTypeQuery, [name, itemId], (error, result) => {
          if (error) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error. Please try again later.',
            });
          }

          const expenseTypeId = result.insertId;

          res.status(201).json({
            status: 'success',
            message: 'ExpenseType added successfully',
            item: { id: itemId, userId: user.id, expenseTypes: [{ id: expenseTypeId, name }] },
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// exports.deleteExpenseType = async (req, res) => {
//   try {
//     const { expenseTypeId } = req.params; 
//     const user = req.userr

//     // Find the document containing the expense types
//     let item = await Item.findOne();

//     if (!item) {
//       return res.status(404).json({ message: 'Expense types not found' });
//     }

//     // Find the index of the expense type to delete
//     const index = item.expenseTypes.findIndex((expenseType) => expenseType.name.toString() === expenseTypeId);

//     if (index === -1) {
//       return res.status(404).json({ message: 'Expense type not found' });
//     }

//     // Remove the expense type from the array
//     item.expenseTypes.splice(index, 1);

//     // Save the updated document
//     await item.save();

//     return res.status(200).json({ message: 'Expense type deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


exports.deleteExpenseType = async (req, res) => {
  try {
    const { expenseTypeId } = req.params;
    const user = req.userr;

    // Check if the expense type exists for the user
    const findItemQuery = 'SELECT i.id AS itemId FROM item AS i JOIN expense_type AS et ON i.id = et.itemId WHERE et.name = ? AND i.userId = ?';
    connection.query(findItemQuery, [expenseTypeId, user.id], async (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Expense type not found' });
      }

      const itemId = results[0].itemId;

      // Delete the expense type record
      const deleteExpenseTypeQuery = 'DELETE FROM expense_type WHERE name = ? AND itemId = ?';
      connection.query(deleteExpenseTypeQuery, [expenseTypeId, itemId], (error, results) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        return res.status(200).json({ message: 'Expense type deleted successfully' });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// exports.updateBasixExpense = async (req, res) => {
//   try {
//     const expenseId = req.params.expenseId;
//     const updates = req.body;
//     const user = req.userr

//     // Find the basic expense using the expenseId
//     const basicExpense = await BasicExpense.findById(expenseId);

//     // Check if the basic expense exists
//     if (!basicExpense) {
//       return res.status(404).json({ error: 'Basic expense not found' });
//     }

//     // Update the basic expense with the provided updates
//     Object.assign(basicExpense, updates);

//     // Save the updated basic expense
//     const updatedBasicExpense = await basicExpense.save();

//     res.status(200).json({
//       status:"success",
//       updatedBasicExpense});
//   } catch (err) {
//     res.status(400).json({ 
//       error: err.message,
//       message:err.message
//      });
//   }
// };


exports.updateBasixExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const updates = req.body;
    const user = req.userr;

    // Check if the basic expense exists
    const findBasicExpenseQuery = 'SELECT userId FROM basic_expenses WHERE id = ?';
    connection.query(findBasicExpenseQuery, [expenseId], async (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Basic expense not found' });
      }

      const basicExpense = results[0];
      const userId = basicExpense.userId;

      // Check if the user has permission to update the expense
      if (userId !== user.id) {
        return res.status(403).json({
          status: 'failed',
          message: 'You do not have permission to update this expense',
        });
      }

      // Update the basic expense using the provided updates
      const updateBasicExpenseQuery = `
        UPDATE basic_expenses
        SET ? 
        WHERE id = ?
      `;

      connection.query(updateBasicExpenseQuery, [updates, expenseId], (error, result) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: 'failed',
            message: 'Basic expense not found',
          });
        }

        // Return the updated basic expense
        res.status(200).json({
          status: 'success',
          updatedBasicExpense: {
            id: expenseId,
            ...updates,
          },
        });
      });
    });
  } catch (error) {
    console.error('Error updating basic expense:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};



// exports.deleteBasicExpense = async (req, res) => {
//   try {
//     const expenseId = req.params.expenseId;
//     const user = req.userr

//     // Find the basic expense using the expenseId
//     const basicExpense = await BasicExpense.findById(expenseId);

//     if (!basicExpense) {
//       return res.status(404).json({ error: 'Basic expense not found' });
//     }

//     await BasicExpense.deleteOne({ _id: expenseId });

//     await Shop.updateMany({}, { $pull: { BasicExpense: expenseId } });

//     res.status(200).json({
//         status:"success",
//        message: 'Basic expense deleted successfully'
//        });
//   } catch (err) {
//     res.status(500).json({ 
//       message:err.message,
//       error: 'An error occurred while deleting the basic expense' });
//   }
// };


exports.deleteBasicExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const user = req.userr;

    // Check if the basic expense exists and fetch its user ID
    const findBasicExpenseQuery = 'SELECT userId FROM basic_expenses WHERE id = ?';
    connection.query(findBasicExpenseQuery, [expenseId], async (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Basic expense not found' });
      }

      const basicExpense = results[0];
      const userId = basicExpense.userId;

      // Check if the user has permission to delete the expense
      if (userId !== user.id) {
        return res.status(403).json({
          status: 'failed',
          message: 'You do not have permission to delete this expense',
        });
      }

      // Delete the basic expense using the provided ID
      const deleteBasicExpenseQuery = 'DELETE FROM basic_expenses WHERE id = ?';
      connection.query(deleteBasicExpenseQuery, [expenseId], (error, result) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: 'failed',
            message: 'Basic expense not found',
          });
        }

        // Update shop records to remove the expense reference
        const updateShopQuery = 'UPDATE shops SET updatedAt = CURRENT_TIMESTAMP() WHERE id IN (SELECT shopId FROM basic_expenses WHERE id = ?)';
        connection.query(updateShopQuery, [expenseId], (error) => {
          if (error) {
            console.error('Error updating shops:', error);
          }
        });

        res.status(200).json({
          status: 'success',
          message: 'Basic expense deleted successfully',
        });
      });
    });
  } catch (error) {
    console.error('Error deleting basic expense:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};




// exports.dailyBasicExpense= async (req, res) => {
//   try {
    
//     const shopId = req.params.shopId;
//     const user = req.userr
//     if(!shopId){
//         return res.status(404).json({ error: 'shop not found' });
//     }
    
//     const queryDate = req.query.date ? new Date(req.query.date) : new Date();

//     // Set the start and end time for the queryDate (midnight to midnight)
//     const startTime = new Date(queryDate);
//     startTime.setHours(0, 0, 0, 0);
//     const endTime = new Date(queryDate);
//     endTime.setHours(23, 59, 59, 999);

//      const expenses = await BasicExpense.find({
//       shopId:shopId,
//       userId:user._id,
//       date: { $gte: startTime, $lte: endTime },
//     });

//     const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
//     res.json({ totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.weeklyBasicExpense =  async (req, res) => {
//   try {
//     const shopId = req.params.shopId;
//     const user = req.userr
//     if (!shopId) {
//       return res.status(404).json({ error: 'Shop not found' });
//     }
//     const queryDate = req.query.date ? new Date(req.query.date) : new Date();

//     // Calculate the start and end dates for the week containing the queryDate
//     const startOfWeek = new Date(queryDate);
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Move to the beginning of the week (Sunday)
//     startOfWeek.setHours(0, 0, 0, 0);

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to the end of the week (Saturday)
//     endOfWeek.setHours(23, 59, 59, 999);

//     // Fetch all expenses for the specific shop and within the specified week
//     const expenses = await BasicExpense.find({
//       shopId: shopId,
//       userId:user._id,
//       date: { $gte: startOfWeek, $lte: endOfWeek },
//     });

//     const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
//     res.json({ totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.monthlyBasicExpense = async (req, res) => {
//   try {
//     const shopId = req.params.shopId;
//     const user = req.userr

//     if (!shopId) {
//       return res.status(404).json({ error: 'Shop not found' });
//     }
//     const queryDate = req.query.date ? new Date(req.query.date) : new Date();

//     // Calculate the start and end dates for the month containing the queryDate
//     const startOfMonth = new Date(queryDate);
//     startOfMonth.setDate(1); // Move to the first day of the month
//     startOfMonth.setHours(0, 0, 0, 0);

//     const endOfMonth = new Date(startOfMonth);
//     endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the first day of the next month
//     endOfMonth.setDate(0); // Move to the last day of the current month
//     endOfMonth.setHours(23, 59, 59, 999);

//     // Fetch all expenses for the specific shop and within the specified month
//     const expenses = await BasicExpense.find({
//       shopId: shopId,
//       userId:user._id,
//       date: { $gte: startOfMonth, $lte: endOfMonth },
//     });

//     const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
//     res.json({ totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.yearlyBasicExpense = async (req, res) => {
//   try {
//     const shopId = req.params.shopId;
//     const user = req.userr

//     if (!shopId) {
//       return res.status(404).json({ error: 'Shop not found' });
//     }
//     const queryDate = req.query.date ? new Date(req.query.date) : new Date();

//     // Calculate the start and end dates for the year containing the queryDate
//     const startOfYear = new Date(queryDate);
//     startOfYear.setMonth(0, 1); // Move to the first day of January
//     startOfYear.setHours(0, 0, 0, 0);

//     const endOfYear = new Date(startOfYear);
//     endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Move to the first day of January of the next year
//     endOfYear.setHours(0, 0, 0, 0);

//     // Fetch all expenses for the specific shop and within the specified year
//     const expenses = await BasicExpense.find({
//       shopId: shopId,
//       userId:user._id,
//       date: { $gte: startOfYear, $lt: endOfYear },
//     });

//     const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
//     res.json({ totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

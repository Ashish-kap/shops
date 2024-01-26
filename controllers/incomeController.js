const createDbConnection = require('./db'); 
const connection = createDbConnection();




exports.createIncome = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const user = req.userr;
    const {
      amount,
      date,
      incomeSource,
      ProductSoldQuantity,
      description,
      billNumber
    } = req.body;

    // Check if the shop exists
    const findShopQuery = 'SELECT userId FROM shops WHERE id = ?';
    connection.query(findShopQuery, [shopId], async (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Shop not found' });
      }

      const shop = results[0];
      const userId = shop.userId;

      // Check if the user has permission to create income for the shop
      if (userId !== user.id) {
        return res.status(403).json({
          status: 'failed',
          message: 'You do not have permission to create income for this shop',
        });
      }

      // Insert the new income into the income table
      const insertIncomeQuery = `
        INSERT INTO income (amount, date, incomeSource, ProductSoldQuantity, description, billNumber, shopId, userId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `;

      connection.query(
        insertIncomeQuery,
        [amount, date, incomeSource, ProductSoldQuantity, description, billNumber, shopId, user.id],
        async (error, results) => {
          if (error) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error. Please try again later.',
            });
          }

          // Update the shop to link to the saved income
          const updateShopQuery = 'UPDATE shops SET updatedAt = CURRENT_TIMESTAMP() WHERE id = ?';
          connection.query(updateShopQuery, [shopId], (error) => {
            if (error) {
              console.error('Error updating shop:', error);
            }
          });

          res.status(201).json({
            status: 'success',
            savedIncome: {
              id: results.insertId, // The ID of the newly inserted row
              amount,
              date,
              incomeSource,
              ProductSoldQuantity,
              description,
              billNumber,
              shopId,
              userId: user.id,
            },
          });
        }
      );
    });
  } catch (error) {
    console.error('Error creating income:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};



exports.updateIncome = async (req, res) => {
  try {
    const incomeId = req.params.incomeId;
    const user = req.userr;
    const updates = req.body;

    // Check if the income exists
    const findIncomeQuery = 'SELECT userId, shopId FROM income WHERE id = ?';
    connection.query(findIncomeQuery, [incomeId], async (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database income error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Income not found' });
      }

      const income = results[0];
      const userId = income.userId;

      // Check if the user has permission to update the income
      if (userId !== user.id) {
        return res.status(403).json({
          status: 'failed',
          message: 'You do not have permission to update this income',
        });
      }

      // Update the income with the provided updates
      const updateIncomeQuery = `
        UPDATE income
        SET amount = ?,
            date = ?,
            incomeSource = ?,
            ProductSoldQuantity = ?,
            description = ?,
            billNumber = ?
        WHERE id = ? AND userId = ?;
      `;

      connection.query(
        updateIncomeQuery,
        [updates.amount, updates.date, updates.incomeSource, updates.ProductSoldQuantity, updates.description, updates.billNumber, incomeId, user.id],
        async (error) => {
          console.log(error)
          if (error) {
            return res.status(500).json({
              status: 'error',
              message: 'Database update error. Please try again later.',
            });
          }

          res.status(200).json({
            status: 'success',
            updatedIncome: {
              id: incomeId,
              amount: updates.amount,
              date: updates.date,
              incomeSource: updates.incomeSource,
              ProductSoldQuantity: updates.ProductSoldQuantity,
              description: updates.description,
              billNumber: updates.billNumber,
              shopId: income.shopId,
              userId: user.id,
            },
          });
        }
      );
    });
  } catch (error) {
    console.error('Error updating income:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};




exports.deleteIncome = async (req, res) => {
  try {
    const incomeId = req.params.incomeId;
    const user = req.userr;

    // Check if the income exists and belongs to the user
    const findIncomeQuery = 'SELECT userId FROM income WHERE id = ?';
    connection.query(findIncomeQuery, [incomeId], async (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Income not found' });
      }

      const income = results[0];
      const userId = income.userId;

      // Check if the user has permission to delete the income
      if (userId !== user.id) {
        return res.status(403).json({
          status: 'failed',
          message: 'You do not have permission to delete this income',
        });
      }

      // Delete the income from the database
      const deleteIncomeQuery = 'DELETE FROM income WHERE id = ? AND userId = ?';
      connection.query(deleteIncomeQuery, [incomeId, user.id], (error) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        res.status(200).json({
          status: 'success',
          message: 'Income deleted successfully',
        });
      });
    });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};




// exports.dailyIncome= async (req, res) => {
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

//      const expenses = await Income.find({
//       shopId: shopId,
//        userId:user._id,
//       date: { $gte: startTime, $lte: endTime },
//     });

//     const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
//     res.json({ totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.weeklyIncome =  async (req, res) => {
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
//     const expenses = await Income.find({
//       shopId: shopId,
//        userId:user._id,
//       date: { $gte: startOfWeek, $lte: endOfWeek },
//     });

//     const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
//     res.json({ totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.monthlyIncome = async (req, res) => {
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
//     const expenses = await Income.find({
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


// exports.yearlyIncome = async (req, res) => {
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
//     const expenses = await Income.find({
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


// get all bill numbers
// exports.getAllBillNumbers = async (req, res) => {
//   try {
//     const user = req.userr
//     const billNumbers = await BillModel.find({userId:user._id});
//     return res.status(200).json({billNumbers});
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


exports.getAllBillNumbers = async (req, res) => {
  try {
    const user = req.userr;

    // MySQL query to fetch bill numbers
    const query = 'SELECT BillNumber FROM bill_modal WHERE userId = ?';

    connection.query(query, [user.id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      // const billNumbers = results.map((row) => row.BillNumber);

      return res.status(200).json({ billNumbers:results });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// exports.hisab = (req, res) => {
//     const shopId = req.params.shopId;
//     const user = req.userr;
//     const userId = user.id

//     const startDate = req.query.start;
//     const endDate = req.query.end;
 

//     const startTime = new Date(startDate);
//     startTime.setHours(0, 0, 0, 0);
//     const endTime = new Date(endDate);
//     endTime.setHours(23, 59, 59, 999);

//   if (!shopId || !userId) {
//     return res.status(400).json({ error: 'Both shopId and userId are required query parameters.' });
//   }

//   const query = `
//     SELECT 
//       shopId,
//       userId,
//       billNumber,
//       SUM(CASE WHEN incomeSource = 'Bank Transfer' THEN amount ELSE 0 END) AS BankTransferTotal,
//       SUM(CASE WHEN incomeSource = 'CASH' THEN amount ELSE 0 END) AS CASHTotal,
//       SUM(CASE WHEN incomeSource = 'Google Pay/Paytm/Phone Pe' THEN amount ELSE 0 END) AS GooglePayTotal,
//       SUM(productSoldQuantity) AS TotalProductQuantity,
//       SUM(amount) AS GrandTotal,
//       (SUM(amount) / SUM(productSoldQuantity)) AS GrandTotalPerProduct
//     FROM income
//     WHERE shopId = ? AND userId = ? AND date BETWEEN ? AND ?
//     GROUP BY shopId, userId, billNumber;
//   `;

//   connection.query(query, [shopId, userId,startTime, endTime], (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query: ' + err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       res.json(results);
//     }
//   });
// };


exports.hisab = (req, res) => {
    const shopId = req.params.shopId;
    const user = req.userr;
    const userId = user.id;

    const startDate = req.query.start;
    const endDate = req.query.end;
    const billNumber = req.query.billNumber;

    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    if (!shopId || !userId) {
        return res.status(400).json({ error: 'Both shopId and userId are required query parameters.' });
    }

    let query = `
    SELECT 
      shopId,
      userId,
      billNumber,
      SUM(CASE WHEN incomeSource = 'Bank Transfer' THEN amount ELSE 0 END) AS BankTransferTotal,
      SUM(CASE WHEN incomeSource = 'CASH' THEN amount ELSE 0 END) AS CASHTotal,
      SUM(CASE WHEN incomeSource = 'Google Pay/Paytm/Phone Pe' THEN amount ELSE 0 END) AS GooglePayTotal,
      SUM(productSoldQuantity) AS TotalProductQuantity,
      SUM(amount) AS GrandTotal,
      ROUND(SUM(amount) / SUM(productSoldQuantity), 1) AS GrandTotalPerProduct
    FROM income
    WHERE shopId = ? AND userId = ?`;

     // (SUM(amount) / SUM(productSoldQuantity)) AS GrandTotalPerProduct
    const queryParams = [shopId, userId];

    if (startDate && endDate) {
        query += ' AND date BETWEEN ? AND ?';
        queryParams.push(startTime, endTime);
    }

    if (billNumber) {
        query += ' AND billNumber = ?';
        queryParams.push(billNumber);
    }

    query += ' GROUP BY shopId, userId, billNumber;';

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query: ' + err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
};


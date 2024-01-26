const createDbConnection = require('./db'); 
const connection = createDbConnection();

exports.createVenderExpense = async (req, res) => {
  try {
    const user = req.userr;
    const vendorId = req.params.vendorId;
    const {
      productName,
      description,
      quantity,
      billNumber,
      date,
      amount,
      paymentDueDate,
      paymentStatus,
    } = req.body;

    // Insert a new vendor expense record
    const createVendorExpenseQuery = `
      INSERT INTO vendor_expense (productName, description, quantity, billNumber, date, amount, paymentDueDate, paymentStatus, userId, vendorId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      createVendorExpenseQuery,
      [productName, description, quantity, billNumber, date, amount, paymentDueDate, paymentStatus, user.id, vendorId],
      (error, results) => {
        if (error) {
          console.log(error)
          return res.status(500).json({
            status: 'error',
            message: 'Database vendor error. Please try again later.',
          });
        }

        const savedVendorExpenseId = results.insertId;

        // Insert the bill number into the 'bill_modal' table
        const createBillNumberQuery = `
          INSERT INTO bill_modal (BillNumber, userId)
          VALUES (?, ?)
        `;

        connection.query(createBillNumberQuery, [billNumber, user.id], (billError) => {
          if (billError) {
            return res.status(500).json({
              status: 'error',
              message: 'Database bill error. Please try again later.',
            });
          }

          res.status(201).json({
            status: 'success',
            savedVendorExpense: {
              id: savedVendorExpenseId,
              productName,
              description,
              quantity,
              billNumber,
              date,
              amount,
              paymentDueDate,
              paymentStatus,
              userId: user.id,
              vendorId,
            },
          });
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      error: 'An error occurred while creating the vendor expense',
    });
  }
};



exports.updateVenderExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const updates = req.body;

    // Find the vendor expense using the expenseId
    const findVendorExpenseQuery = 'SELECT * FROM vendor_expense WHERE id = ?';
    connection.query(findVendorExpenseQuery, [expenseId], (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Vendor expense not found' });
      }

      const vendorExpense = results[0];

      // Update the vendor expense with the provided updates
      const updateVendorExpenseQuery = 'UPDATE vendor_expense SET ? WHERE id = ?';
      connection.query(updateVendorExpenseQuery, [updates, expenseId], (updateError) => {
        if (updateError) {
          console.log(updateError)
          return res.status(500).json({
            status: 'error',
            message: 'Database vendor error. Please try again later.',
          });
        }

        res.status(200).json({
          status: 'success',
          updatedVendorExpense: { ...vendorExpense, ...updates },
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ 
      message: error.message,
      error: error.message 
    });
  }
};



exports.deleteVendorExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;

    // Find the vendor expense using the expenseId
    const findVendorExpenseQuery = 'SELECT * FROM vendor_expense WHERE id = ?';
    connection.query(findVendorExpenseQuery, [expenseId], (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Vendor expense not found' });
      }

      // Delete the vendor expense from the database
      const deleteVendorExpenseQuery = 'DELETE FROM vendor_expense WHERE id = ?';
      connection.query(deleteVendorExpenseQuery, [expenseId], (deleteError) => {
        if (deleteError) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        res.status(200).json({
          status: 'success',
          message: 'Vendor expense deleted successfully',
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      error: 'An error occurred while deleting the vendor expense',
    });
  }
};




exports.dailyBasicExpense= async (req, res) => {
  try {

    const user = req.userr;
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    const startTime = new Date(queryDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(queryDate);
    endTime.setHours(23, 59, 59, 999);

     const expenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.weeklyBasicExpense =  async (req, res) => {
  try {
    const user = req.userr

    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the week containing the queryDate
    const startOfWeek = new Date(queryDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Move to the beginning of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to the end of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);

    // Fetch all expenses for the specific shop and within the specified week
    const expenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.monthlyBasicExpense = async (req, res) => {
  try {
    const user = req.userr
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the month containing the queryDate
    const startOfMonth = new Date(queryDate);
    startOfMonth.setDate(1); // Move to the first day of the month
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the first day of the next month
    endOfMonth.setDate(0); // Move to the last day of the current month
    endOfMonth.setHours(23, 59, 59, 999);

    // Fetch all expenses for the specific shop and within the specified month
    const expenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.yearlyBasicExpense = async (req, res) => {
  try {

    const user = req.userr
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the year containing the queryDate
    const startOfYear = new Date(queryDate);
    startOfYear.setMonth(0, 1); // Move to the first day of January
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(startOfYear);
    endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Move to the first day of January of the next year
    endOfYear.setHours(0, 0, 0, 0);

    // Fetch all expenses for the specific shop and within the specified year
    const expenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startOfYear, $lt: endOfYear },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

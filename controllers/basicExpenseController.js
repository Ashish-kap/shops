const BasicExpense = require('../model/basicExpense.js');
const Shop = require('../model/shop.js'); 
const Item = require('../model/expenseType.js'); 


// Endpoint to add new basic expenses
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

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const savedBasicExpenses = [];
    for (const { amount, expenseName } of amountsAndNames) {
      const newBasicExpense = new BasicExpense({
        expenseName,
        amount,
        date,
        description,
        shopId,
        forWhichEmployee,
        userId: user._id,
      });

      const savedExpense = await newBasicExpense.save();
      savedBasicExpenses.push(savedExpense._id);

      shop.BasicExpense.push(savedExpense._id);
    }

    await shop.save();

    res.status(201).json({
      status: 'success',
      savedBasicExpenses,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
      message: err.message,
    });
  }
};


// Get Expense type
exports.getAllExpenseTypes = async (req, res) => {
  try {
    // Find the document containing the expense types
    const user = req.userr
    const item = await Item.findOne({userId:user._id});

    if (!item || !item.expenseTypes || item.expenseTypes.length === 0) {
      return res.status(404).json({ message: 'Expense types not found' });
    }

    // Extract the expense types from the document
    const expenseTypes = item.expenseTypes.map((expenseType) => expenseType);

    return res.status(200).json({ expenseTypes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.addExpenseType = async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.userr

    if (!name) {
      return res.status(400).json({ message: 'Expense Type name is required' });
    }

    // Find the existing document or create a new one if it doesn't exist
    let item = await Item.findOne({userId:user._id});

    if (!item) {
      item = new Item({ expenseTypes: [],userId:user._id });
    }

    // Check if the expense type with the same name already exists
    const existingExpenseType = item.expenseTypes.find(
      (expenseType) => expenseType.name === name
    );

    if (existingExpenseType) {
      return res.status(400).json({ message: 'Expense Type already exists' });
    }

    // Add the new expense type to the array
    item.expenseTypes.push({ name });

    // Save the updated document
    await item.save();

    return res.status(201).json({ 
      status:"success",
      message: 'ExpenseType added successfully',
      item 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



exports.deleteExpenseType = async (req, res) => {
  try {
    const { expenseTypeId } = req.params; // Get the expense type ID from the request parameters
    const user = req.userr

    // Find the document containing the expense types
    let item = await Item.findOne();

    if (!item) {
      return res.status(404).json({ message: 'Expense types not found' });
    }

    // Find the index of the expense type to delete
    const index = item.expenseTypes.findIndex((expenseType) => expenseType.name.toString() === expenseTypeId);

    if (index === -1) {
      return res.status(404).json({ message: 'Expense type not found' });
    }

    // Remove the expense type from the array
    item.expenseTypes.splice(index, 1);

    // Save the updated document
    await item.save();

    return res.status(200).json({ message: 'Expense type deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updateBasixExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const updates = req.body;
    const user = req.userr

    // Find the basic expense using the expenseId
    const basicExpense = await BasicExpense.findById(expenseId);

    // Check if the basic expense exists
    if (!basicExpense) {
      return res.status(404).json({ error: 'Basic expense not found' });
    }

    // Update the basic expense with the provided updates
    Object.assign(basicExpense, updates);

    // Save the updated basic expense
    const updatedBasicExpense = await basicExpense.save();

    res.status(200).json({
      status:"success",
      updatedBasicExpense});
  } catch (err) {
    res.status(400).json({ 
      error: err.message,
      message:err.message
     });
  }
};


exports.deleteBasicExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const user = req.userr

    // Find the basic expense using the expenseId
    const basicExpense = await BasicExpense.findById(expenseId);

    // Check if the basic expense exists
    if (!basicExpense) {
      return res.status(404).json({ error: 'Basic expense not found' });
    }

    // Delete the basic expense from the database
    await BasicExpense.deleteOne({ _id: expenseId });

    // Remove the basic expense reference from the associated shop
    await Shop.updateMany({}, { $pull: { BasicExpense: expenseId } });

    res.status(200).json({
        status:"success",
       message: 'Basic expense deleted successfully'
       });
  } catch (err) {
    // If any error occurs during the try block, it will be caught here
    // You can customize the error response based on different types of errors
    res.status(500).json({ 
      message:err.message,
      error: 'An error occurred while deleting the basic expense' });
  }
};


exports.dailyBasicExpense= async (req, res) => {
  try {
    
    const shopId = req.params.shopId;
    const user = req.userr
    if(!shopId){
        return res.status(404).json({ error: 'shop not found' });
    }
    
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Set the start and end time for the queryDate (midnight to midnight)
    const startTime = new Date(queryDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(queryDate);
    endTime.setHours(23, 59, 59, 999);

     const expenses = await BasicExpense.find({
      shopId:shopId,
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
    const shopId = req.params.shopId;
    const user = req.userr
    if (!shopId) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the week containing the queryDate
    const startOfWeek = new Date(queryDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Move to the beginning of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to the end of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);

    // Fetch all expenses for the specific shop and within the specified week
    const expenses = await BasicExpense.find({
      shopId: shopId,
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
    const shopId = req.params.shopId;
    const user = req.userr

    if (!shopId) {
      return res.status(404).json({ error: 'Shop not found' });
    }
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
    const expenses = await BasicExpense.find({
      shopId: shopId,
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
    const shopId = req.params.shopId;
    const user = req.userr

    if (!shopId) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the year containing the queryDate
    const startOfYear = new Date(queryDate);
    startOfYear.setMonth(0, 1); // Move to the first day of January
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(startOfYear);
    endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Move to the first day of January of the next year
    endOfYear.setHours(0, 0, 0, 0);

    // Fetch all expenses for the specific shop and within the specified year
    const expenses = await BasicExpense.find({
      shopId: shopId,
      userId:user._id,
      date: { $gte: startOfYear, $lt: endOfYear },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

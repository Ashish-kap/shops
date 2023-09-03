const BasicExpense = require('../model/basicExpense.js');
const Shop = require('../model/shop.js'); 

//Endpoint to add a new basic expense
exports.createBasicExpense = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const {
      expenseName,
      amount,
      date,
      description,
    } = req.body;

    //Create a new instance of the BasicExpense model with the request data
    const newBasicExpense = new BasicExpense({
      expenseName,
      amount,
      date,
      description,
      shopId
    });

    //Find the shop using the shopId
    const shop = await Shop.findById(shopId);

    if(!shop){
      return res.status(404).json({ error: 'shop not found' });
    }

    //Save the new basic expense to the database
    const savedBasicExpense = await newBasicExpense.save();

    //Add the new vendor expense to the Shop's VendorExpense array
    shop.BasicExpense.push(savedBasicExpense._id);

    //Save the updated Shop document with the associated vendor expense
    await shop.save();

    res.status(201).json({
      status:"success",
      savedBasicExpense
    });
  } catch (err) {
    res.status(400).json({ 
      error: err.message,
      message:err.message
     });
  }
};

exports.updateBasixExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const updates = req.body;

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
      shopId: shopId,
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
      date: { $gte: startOfYear, $lt: endOfYear },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

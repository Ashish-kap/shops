const Income = require('../model/income.js');
const Shop = require('../model/shop.js'); 

exports.createIncome = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const user = req.userr
    const {
      amount,
      date,
      incomeSource,
      ProductSoldQuantity,
      description,
      billNumber
    } = req.body;

    // Create a new instance of the Income model with the request data
    const newIncome = new Income({
      amount,
      date,
      incomeSource,
      ProductSoldQuantity,
      description,
      billNumber,
      shopId,
      userId:user._id,
    });

    // Find the shop using the shopId
    const shop = await Shop.findById(shopId);

    if(!shop){
      return res.status(404).json({ error: 'shop not found' });
    }

    // Save the new basic income to the database
    const savedIncome = await newIncome.save();

    // Add the new vendor income to the Shop's Vendorincome array
    shop.Income.push(savedIncome._id);

    // Save the updated Shop document with the associated vendor income
    await shop.save();

    res.status(201).json({
      status:"success",
      savedIncome
    });
    
  } catch (err) {
      res.status(400).json({ 
        error: err,
        message:err.message
      });
  }
};


exports.updateIncome = async (req, res) => {
  try {
    const incomeId = req.params.incomeId;
    const user = req.userr
    const updates = req.body;

    // Find the basic income using the incomeId
    const IncomeData = await Income.findById(incomeId);

    // Check if the basic income exists
    if (!IncomeData) {
      return res.status(404).json({ error: ' income not found' });
    }

    // Update the basic income with the provided updates
    Object.assign(IncomeData, updates);

    // Save the updated basic income
    const updatedIncome = await IncomeData.save();

    res.status(200).json({
      status:"success",
      updatedIncome
    });

  } catch (err) {
    res.status(400).json({ 
      message:err.message,
      error: err.message
    });
  }
};


exports.deleteIncome = async (req, res) => {
  try {
    const incomeId = req.params.incomeId;
    const user = req.userr

    // Find the basic income using the incomeId
    const IncomeData = await Income.findById(incomeId);

    // Check if the basic income exists
    if (!IncomeData) {
      return res.status(404).json({ error: 'Basic income not found' });
    }

    // Delete the basic income from the database
    await IncomeData.deleteOne({ _id: incomeId });

    // Remove the basic income reference from the associated shop
    await Shop.updateMany({}, { $pull: { Income: incomeId } });

    res.status(200).json({ 
      status:"success",
      message: 'Basic income deleted successfully'
     });
  } catch (err) {
    // If any error occurs during the try block, it will be caught here
    // You can customize the error response based on different types of errors
    res.status(500).json({ 
      message:err.message,
      error: 'An error occurred while deleting the basic income' });
  }
};



exports.dailyIncome= async (req, res) => {
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

     const expenses = await Income.find({
      shopId: shopId,
       userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.weeklyIncome =  async (req, res) => {
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
    const expenses = await Income.find({
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


exports.monthlyIncome = async (req, res) => {
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
    const expenses = await Income.find({
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


exports.yearlyIncome = async (req, res) => {
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
    const expenses = await Income.find({
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

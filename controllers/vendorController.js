
const VendorExpense = require('../model/vendor.js');
const BillModal = require('../model/billModel.js');
const Shop = require('../model/shop.js'); 

// Endpoint to add a new vendor expense
exports.createVenderExpense= async (req, res) => {
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
      category,
      paymentDueDate,
      paymentStatus,
    } = req.body;

    // Create a new instance of the VendorExpense model with the request data
    const newVendorExpense = new VendorExpense({
      productName,
      description,
      quantity,
      date,
      amount,
      category,
      paymentDueDate,
      billNumber,
      paymentStatus,
      vendorId,
      userId:user._id
    });



    const saveBillNumber = new BillModal({
      BillNumber:billNumber,
      userId:user._id
    })

    // Save the new vendor expense to the database
    const savedVendorExpense = await newVendorExpense.save();
    await saveBillNumber.save();

    res.status(201).json({
      status:"success",
      savedVendorExpense
    });

  }catch(err) {
    res.status(400).json({ 
      error: err.message,
      message: err.message
    });
  }
};



exports.updateVenderExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const updates = req.body;

    // Find the vendor expense using the expenseId
    const vendorExpense = await VendorExpense.findById(expenseId);

    // Check if the vendor expense exists
    if (!vendorExpense) {
      return res.status(404).json({ error: 'Vendor expense not found' });
    }

    // Update the vendor expense with the provided updates
    Object.assign(vendorExpense, updates);

    // Save the updated vendor expense
    const updatedVendorExpense = await vendorExpense.save();

    res.status(200).json({
      status:"success",
      updatedVendorExpense
    });

  } catch (err) {
    res.status(400).json({ 
      message:err.message,
      error: err.message 
    });
  }
};



exports.deleteVendorExpense =  async (req, res) => {
  try {
    const expenseId = req.params.expenseId;

    // Find the vendor expense using the expenseId
    const vendorExpense = await VendorExpense.findById(expenseId);

    // Check if the vendor expense exists
    if (!vendorExpense) {
      return res.status(404).json({ error: 'Vendor expense not found' });
    }

     // Delete the vendor expense from the database
    await VendorExpense.deleteOne({ _id: expenseId });

    // Remove the basic expense reference from the associated shop
    await Shop.updateMany({}, { $pull: { VendorExpense: expenseId } });

    res.status(200).json({
      status:"success",
       message: 'Vendor expense deleted successfully'
   });
  } catch (err) {
    console.log(err)
    res.status(500).json({ 
      message:err.message,
      error: 'An error occurred while deleting the vendor expense'
    });
  }
};




exports.dailyBasicExpense= async (req, res) => {
  try {
    

    const user = req.userr;

    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Set the start and end time for the queryDate (midnight to midnight)
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


const EmployeeSalary = require('../model/employee.js');
const Employee = require('../model/registerEmployee.js');
const Shop = require('../model/shop.js'); 

// exports.createEmployeeSalaries =  async (req, res) => {
//   try {
//     const shopId = req.params.shopId;
//     const {
//       employeeName,
//       salaryAmount,
//       date,
//       paymentMethod,
//       description
//     } = req.body;

//     // Create a new instance of the EmployeeSalary model with the request data
//     const newEmployeeSalary = new EmployeeSalary({
//       employeeName,
//       salaryAmount,
//       date,
//       paymentMethod,
//       description,
//       shopId
//     });

    
//     // Find the shop using the shopId
//     const shop = await Shop.findById(shopId);

//     if(!shop){
//         return res.status(404).json({ error: 'shop not found' });
//     }

//     // Save the new employee salary to the database
//     const savedEmployeeSalary = await newEmployeeSalary.save();

//     // Add the new vendor expense to the Shop's VendorExpense array
//     shop.EmployeeSalary.push(savedEmployeeSalary._id);

//     // Save the updated Shop document with the associated vendor expense
//     await shop.save();

//     res.status(201).json({
//       status:"success",
//       savedEmployeeSalary
//     });
//   } catch (err) {
//     res.status(400).json({ 
//       error: err.message,
//       message: err.message
//      });
//   }
// };


 exports.createEmployeeSalaries =async (req, res) => {
  try {
    const shopId = req.params.shopId;
    if(!shopId){
        return res.status(404).json({ error: 'shop not found' });
    }
    const employeeId=req.params.employeeId

    // Get the employee's current balance from the database
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Create the employee salary record
    const employeeSalary = new EmployeeSalary({
      salaryAmount:req.body.salaryAmount,
      date: req.body.date,
      description: req.body.description,
      paymentMethod: req.body.paymentMethod,
      shopId,
      employeeId
    });

    // Calculate the new balance by deducting salaryAmount from the balanced field
    const newBalance = employee.balanced - employeeSalary.salaryAmount;
    employee.balanced = newBalance;

    await employee.save();
    // Save the employee salary record to the database
    await employeeSalary.save();

    res.status(201).json({
      status:"success",
      employeeSalary
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ 
      message:error.message,
      error: 'Internal server error' });
  }
};



exports.updateEmployeeExpense =  async (req, res) => {
  try {
    const salaryId = req.params.salaryId;
    const updates = req.body;

    // Find the employee salary using the salaryId
    const employeeSalary = await EmployeeSalary.findById(salaryId);

    // Check if the employee salary exists
    if (!employeeSalary) {
      return res.status(404).json({ error: 'Employee salary not found' });
    }

    // Update the employee salary with the provided updates
    Object.assign(employeeSalary, updates);

    // Save the updated employee salary
    const updatedEmployeeSalary = await employeeSalary.save();

    res.status(200).json({
      status:"success",
      updatedEmployeeSalary
    });
  } catch (err) {

    res.status(400).json({ 
      message:err.messagem,
      error: err.message
     });
  }
};


exports.deleteEmployeeExpense = async (req, res) => {
  try {
    const salaryId = req.params.salaryId;
    const employeeId = req.params.employeeId

    // Find the employee salary using the salaryId
    const employeeSalary = await EmployeeSalary.findById(salaryId);

    // Check if the employee salary exists
    if (!employeeSalary) {
      return res.status(404).json({ error: 'Employee salary not found' });
    }

    const employee = await Employee.findById(employeeId);

    const newBalance = employee.balanced + employeeSalary.salaryAmount;
    employee.balanced = newBalance;

    // Delete the employee salary from the database
    await EmployeeSalary.deleteOne({ _id: salaryId });

    await employee.save();

    await Shop.updateMany({}, { $pull: { EmployeeSalary: salaryId } });


    res.status(200).json({ 
      status:"success",
      message: 'Employee salary deleted successfully'
     });
  } catch (err) {
    res.status(500).json({ 
      message:err.message,
      error: 'An error occurred while deleting the employee salary' });
  }
};


exports.dailyEmployeeExpense= async (req, res) => {
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

    const expenses = await EmployeeSalary.find({
      shopId: shopId,
      date: { $gte: startTime, $lte: endTime },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.weeklyEmployeeExpense =  async (req, res) => {
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
    const expenses = await EmployeeSalary.find({
      shopId: shopId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.monthlyEmployeeExpense = async (req, res) => {
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
    const expenses = await EmployeeSalary.find({
      shopId: shopId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.yearlyEmployeeExpense = async (req, res) => {
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
    const expenses = await EmployeeSalary.find({
      shopId: shopId,
      date: { $gte: startOfYear, $lt: endOfYear },
    });

    const totalExpense = expenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    res.json({ totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


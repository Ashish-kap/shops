const BasicExpense = require('../model/basicExpense.js');
const Income = require('../model/income.js');
const Shop = require('./../model/shop');
const VendorExpense = require('../model/vendor.js');
const EmployeeSalary = require('../model/employee.js');

const Employee = require('../model/registerEmployee.js');
const Vendor = require('../model/registerVendor.js');

const PDFDocument = require('pdfkit');
// const { PDFDocument, rgb } = require('pdf-lib');
// const fs = require('fs');


exports.allBasicExpenses = async (req, res) => {
  try {
    const shopId = req.params.shopId
    const basicExpenses = await BasicExpense.find({ shopId });

    const allExpenses = [...basicExpenses];

    allExpenses.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json({ allExpenses });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.allVendorExpenses = async (req, res) => {
  try {
    const shopId = req.params.shopId
    const vendorId = req.params.vendorId
    const vendorExpenses = await VendorExpense.find({ shopId,vendorId });

    const vendor= await Vendor.findById(vendorId)

    const allExpenses = [...vendorExpenses];

    allExpenses.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json({ vendor,allExpenses });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.allEmployeeExpenses = async (req, res) => {
  try {
    const shopId = req.params.shopId
    const employeeId = req.params.employeeId
    const employeeExpenses = await EmployeeSalary.find({ shopId, employeeId });

    const employee = await Employee.findById(employeeId)

    const allExpenses = [...employeeExpenses];

    allExpenses.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json({ employee,allExpenses });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.allIncome = async (req, res) => {
  try {
    const shopId = req.params.shopId
    const allIncomes = await Income.find({ shopId });

    const allIncome = [...allIncomes];

    allIncome.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json({ allIncome });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.allExpenses = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const response = await fetch(`http://localhost:3000/demo/${shopId}`);
    const responseData = await response.json();

    const {
      shopName,
      totalProfitByShop,
      totalIncomeByShop,
      totalExpenseByShop,
      registerEmployee,
      registerVendor,
      basicExpenses,
      incomeData,
    } = responseData;

    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffer => buffers.push(buffer));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);

      res.setHeader('Content-Disposition', `attachment; filename="expenses_report.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');
      res.end(pdfBuffer);
    });

    // Customize styling
    doc.font('Helvetica-Bold').fontSize(24).text(`${shopName} - Expenses Report`, { align: 'center' });

    // List of fields to exclude
    const excludedFields = ['_id', '__v', 'shopId', 'employeeId', 'vendorId', 'createdAt', 'expenses'];

    function generateSection(sectionTitle, data) {
      doc.moveDown();
      doc.font('Helvetica-Bold').fontSize(18).text(sectionTitle, { underline: true });

      data.forEach(entry => {
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(14);

        for (const key in entry) {
          if (!excludedFields.includes(key) && entry[key] !== null && entry[key] !== '') {
            doc.fillColor('black').font('Helvetica-Bold').text(`${key}:`, { continued: true }).fillColor('black');
            doc.font('Helvetica').text(`${entry[key]}`, { align: 'left' });
          }
        }

        if (entry.expenses && entry.expenses.length > 0) {
          doc.moveDown();
          doc.font('Helvetica-Bold').fontSize(14).text('Expenses:', { underline: true });

          entry.expenses.forEach(expense => {
            doc.moveDown();
            doc.font('Helvetica-Bold').fontSize(14);

            for (const expenseKey in expense) {
              if (!excludedFields.includes(expenseKey) && expense[expenseKey] !== null && expense[expenseKey] !== '') {
                doc.fillColor('black').font('Helvetica-Bold').text(`${expenseKey}:`, { continued: true }).fillColor('black');
                doc.font('Helvetica').text(`${expense[expenseKey]}`, { align: 'left' });
              }
            }
          });
        }

        doc.moveDown();
      });
    }

    generateSection('Employees', registerEmployee);
    generateSection('Vendors', registerVendor);
    generateSection('Basic Expenses', basicExpenses);
    generateSection('Income', incomeData);

    doc.font('Helvetica-Bold').fillColor('green').fontSize(16).text(`Total Profit: ${totalProfitByShop}`, { align: 'left' });
    doc.font('Helvetica-Bold').fillColor('blue').fontSize(16).text(`Total Income: ${totalIncomeByShop}`, { align: 'left' });
    doc.font('Helvetica-Bold').fillColor('red').fontSize(16).text(`Total Expense: ${totalExpenseByShop}`, { align: 'left' });

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




exports.demo = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const registerEmployee = await Employee.find({ shopId });
    const registerVendor = await Vendor.find({ shopId });
    const basicExpenses = await BasicExpense.find({ shopId });
    const vendorExpenses = await VendorExpense.find({ shopId });
    const employeeExpenses = await EmployeeSalary.find({ shopId });
    const incomeData = await Income.find({ shopId });

    const whichShop = await Shop.findById(shopId);
    const shopName = whichShop.name
    // Map employee expenses to each employee
    const employeesWithExpenses = registerEmployee.map(employee => {
      const expenses = employeeExpenses.filter(expense => expense.employeeId.toString() === employee._id.toString());
      return { ...employee.toObject(), expenses };
    });

    // Map vendor expenses to each vendor
    const vendorsWithExpenses = registerVendor.map(vendor => {
      const expenses = vendorExpenses.filter(expense => expense.vendorId.toString() === vendor._id.toString());
      return { ...vendor.toObject(), expenses };
    });


    const totalIncomeByShop = incomeData.reduce((total, expense) => total + expense.amount, 0);

    const totalDailyVendorExpenseByShop = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalDailyEmployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalDailyBasicExpenseByShop = basicExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalProfitByShop = totalIncomeByShop - (totalDailyVendorExpenseByShop +totalDailyEmployeeExpenseByShop+totalDailyBasicExpenseByShop)
    const totalExpenseByShop = totalDailyVendorExpenseByShop+totalDailyEmployeeExpenseByShop+totalDailyBasicExpenseByShop


    res.status(200).json({
      shopName,
      registerEmployee: employeesWithExpenses,
      registerVendor: vendorsWithExpenses,
      basicExpenses,
      incomeData,
      totalIncomeByShop,
      totalProfitByShop,
      totalExpenseByShop

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






exports.selectPeriod=async (req, res) => {
  try {
    
    // const queryDate = req.query.date ? new Date(req.query.date) : new Date();
    const startDate = req.query.start
    const endDate = req.query.end

    // Set the start and end time for the queryDate (midnight to midnight)
    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    console.log("Parsed start date:", startTime);
    console.log("Parsed end date:", endTime);

    const basicExpenses = await BasicExpense.find({
      date: { $gte: startTime, $lte: endTime },
    });

    const employeeExpenses = await EmployeeSalary.find({
      date: { $gte: startTime, $lte: endTime },
    });

    const vendorExpenses = await VendorExpense.find({
      date: { $gte: startTime, $lte: endTime },
    });


    const income = await Income.find({
      date: { $gte: startTime, $lte: endTime },
    });

    const totalIncome = income.reduce((total, expense) => total + expense.amount, 0);

    const totalDailyVendorExpense = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalDailyEmployeeExpense = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalDailyBasicExpense = basicExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalProfit = totalIncome - (totalDailyVendorExpense +totalDailyEmployeeExpense+totalDailyBasicExpense)
    const totalExpense = totalDailyVendorExpense+totalDailyEmployeeExpense+totalDailyBasicExpense

    res.json({ totalProfit,totalIncome,totalExpense });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.selectPeriodForShop=async (req, res) => {
  try {
    
    const shopId = req.params.shopId;
    if(!shopId){
        return res.status(404).json({ error: 'shop not found' });
    }

    // const queryDate = req.query.date ? new Date(req.query.date) : new Date();
    const startDate = req.query.start
    const endDate = req.query.end

    // Set the start and end time for the queryDate (midnight to midnight)
    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    console.log("Parsed start date:", startTime);
    console.log("Parsed end date:", endTime);

    const basicExpenses = await BasicExpense.find({
      shopId: shopId,
      date: { $gte: startTime, $lte: endTime },
    });

    const employeeExpenses = await EmployeeSalary.find({
      shopId: shopId,
      date: { $gte: startTime, $lte: endTime },
    });

    const vendorExpenses = await VendorExpense.find({
      shopId: shopId,
      date: { $gte: startTime, $lte: endTime },
    });


    const income = await Income.find({
      date: { $gte: startTime, $lte: endTime },
    });

    const totalIncome = income.reduce((total, expense) => total + expense.amount, 0);

    const totalDailyVendorExpense = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalDailyEmployeeExpense = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalDailyBasicExpense = basicExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalProfit = totalIncome - (totalDailyVendorExpense +totalDailyEmployeeExpense+totalDailyBasicExpense)
    const totalExpense = totalDailyVendorExpense+totalDailyEmployeeExpense+totalDailyBasicExpense

    res.json({ totalProfit,totalIncome,totalExpense });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.dailyProfitByShop= async (req, res) => {
  try {
    const shopId = req.params.shopId;
    if(!shopId){
        return res.status(404).json({ error: 'shop not found' });
    }

    const oneShop = await Shop.findById(shopId)
    const name = oneShop.name;
    const address = oneShop.address
    const contactInformation = oneShop.contactInformation

    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Set the start and end time for the queryDate (midnight to midnight)
    const startTime = new Date(queryDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(queryDate);
    endTime.setHours(23, 59, 59, 999);

    const basicExpenses = await BasicExpense.find({
      shopId: shopId,
      date: { $gte: startTime, $lte: endTime },
    });

    const employeeExpenses = await EmployeeSalary.find({
      shopId: shopId,
      date: { $gte: startTime, $lte: endTime },
    });

    const vendorExpenses = await VendorExpense.find({
      shopId: shopId,
      date: { $gte: startTime, $lte: endTime },
    });


    const income = await Income.find({
      shopId: shopId,
      date: { $gte: startTime, $lte: endTime },
    });

    const totalIncomeByShop = income.reduce((total, expense) => total + expense.amount, 0);

    const totalDailyVendorExpenseByShop = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalDailyEmployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalDailyBasicExpenseByShop = basicExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalProfitByShop = totalIncomeByShop - (totalDailyVendorExpenseByShop +totalDailyEmployeeExpenseByShop+totalDailyBasicExpenseByShop)
    const totalExpenseByShop = totalDailyVendorExpenseByShop+totalDailyEmployeeExpenseByShop+totalDailyBasicExpenseByShop

    res.json({ totalProfitByShop,totalIncomeByShop,totalExpenseByShop,name,address,contactInformation });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.dailyProfit= async (req, res) => {
  try {
    
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Set the start and end time for the queryDate (midnight to midnight)
    const startTime = new Date(queryDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(queryDate);
    endTime.setHours(23, 59, 59, 999);

    const basicExpenses = await BasicExpense.find({
      date: { $gte: startTime, $lte: endTime },
    });

    const employeeExpenses = await EmployeeSalary.find({
      date: { $gte: startTime, $lte: endTime },
    });

    const vendorExpenses = await VendorExpense.find({
      date: { $gte: startTime, $lte: endTime },
    });


    const income = await Income.find({
      date: { $gte: startTime, $lte: endTime },
    });

    const totalIncome = income.reduce((total, expense) => total + expense.amount, 0);

    const totalDailyVendorExpense = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalDailyEmployeeExpense = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalDailyBasicExpense = basicExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalProfit = totalIncome - (totalDailyVendorExpense +totalDailyEmployeeExpense+totalDailyBasicExpense)
    const totalExpense = totalDailyVendorExpense+totalDailyEmployeeExpense+totalDailyBasicExpense

    res.json({ totalProfit,totalIncome,totalExpense });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.weeklyProfitByShop= async (req, res) => {
  try {
    const shopId = req.params.shopId;
    if(!shopId){
        return res.status(404).json({ error: 'shop not found' });
    }

    const oneShop = await Shop.findById(shopId)
    const name = oneShop.name;
    const address = oneShop.address
    const contactInformation = oneShop.contactInformation

    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the week containing the queryDate
    const startOfWeek = new Date(queryDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Move to the beginning of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to the end of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);

    const basicExpenses = await BasicExpense.find({
      shopId: shopId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const employeeExpenses = await EmployeeSalary.find({
      shopId: shopId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const vendorExpenses = await VendorExpense.find({
      shopId: shopId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });


    const income = await Income.find({
      shopId: shopId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const totalIncomeByShop = income.reduce((total, expense) => total + expense.amount, 0);

    const totalWeeklyVendorExpenseByShop = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalWeeklyEmployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalWeeklyBasicExpenseByShop = basicExpenses.reduce((total, expense) => total + expense.amount, 0);

    const totalProfitByShop = totalIncomeByShop - (totalWeeklyVendorExpenseByShop+totalWeeklyEmployeeExpenseByShop+totalWeeklyBasicExpenseByShop)
    const totalExpenseByShop = totalWeeklyVendorExpenseByShop+totalWeeklyEmployeeExpenseByShop+totalWeeklyBasicExpenseByShop
    res.json({ totalProfitByShop,totalIncomeByShop,totalExpenseByShop,name,address,contactInformation});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};


// weekly profit

exports.weeklyProfit= async (req, res) => {
  try {
    
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the week containing the queryDate
    const startOfWeek = new Date(queryDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Move to the beginning of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to the end of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);

    const basicExpenses = await BasicExpense.find({
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const employeeExpenses = await EmployeeSalary.find({
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const vendorExpenses = await VendorExpense.find({
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });


    const income = await Income.find({
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const totalIncome = income.reduce((total, expense) => total + expense.amount, 0);

    const totalWeeklyVendorExpense = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalWeeklyEmployeeExpense = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalWeeklyBasicExpense = basicExpenses.reduce((total, expense) => total + expense.amount, 0);

    const totalProfit = totalIncome - (totalWeeklyVendorExpense+totalWeeklyEmployeeExpense+totalWeeklyBasicExpense)
    const totalExpense = totalWeeklyVendorExpense+totalWeeklyEmployeeExpense+totalWeeklyBasicExpense
    res.json({ totalProfit,totalIncome,totalExpense });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};


// monthly profit by shop

exports.monthlyProfitByShop= async (req, res) => {
  try {
    const shopId = req.params.shopId;
    if(!shopId){
        return res.status(404).json({ error: 'shop not found' });
    }

    const oneShop = await Shop.findById(shopId)
    const name = oneShop.name;
    const address = oneShop.address
    const contactInformation = oneShop.contactInformation

    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the month containing the queryDate
    const startOfMonth = new Date(queryDate);
    startOfMonth.setDate(1); // Move to the first day of the month
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the first day of the next month
    endOfMonth.setDate(0); // Move to the last day of the current month
    endOfMonth.setHours(23, 59, 59, 999);


    const basicExpenses = await BasicExpense.find({
      shopId: shopId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const employeeExpenses = await EmployeeSalary.find({
      shopId: shopId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const vendorExpenses = await VendorExpense.find({
      shopId: shopId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });


    const income = await Income.find({
      shopId: shopId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalIncomeByShop = income.reduce((total, expense) => total + expense.amount, 0);

    const totalMonthlyVendorExpenseByShop = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalMonthlyEmployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalMonthlyBasicExpenseByShop = basicExpenses.reduce((total, expense) => total + expense.amount, 0);

    const totalProfitByShop = totalIncomeByShop - (totalMonthlyVendorExpenseByShop+totalMonthlyEmployeeExpenseByShop+totalMonthlyBasicExpenseByShop)
    const totalExpenseByShop = totalMonthlyVendorExpenseByShop+totalMonthlyEmployeeExpenseByShop+totalMonthlyBasicExpenseByShop

    res.json({ totalProfitByShop,totalIncomeByShop,totalExpenseByShop,name,address,contactInformation});

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};


//  monthly profit

exports.monthlyProfit= async (req, res) => {
  try {
    

    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the month containing the queryDate
    const startOfMonth = new Date(queryDate);
    startOfMonth.setDate(1); // Move to the first day of the month
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the first day of the next month
    endOfMonth.setDate(0); // Move to the last day of the current month
    endOfMonth.setHours(23, 59, 59, 999);


    const basicExpenses = await BasicExpense.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const employeeExpenses = await EmployeeSalary.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const vendorExpenses = await VendorExpense.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });


    const income = await Income.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalIncome = income.reduce((total, expense) => total + expense.amount, 0);

    const totalMonthlyVendorExpense = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalMonthlyEmployeeExpense = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalMonthlyBasicExpense = basicExpenses.reduce((total, expense) => total + expense.amount, 0);

    const totalProfit = totalIncome - (totalMonthlyVendorExpense+totalMonthlyEmployeeExpense+totalMonthlyBasicExpense)
    const totalExpense = totalMonthlyVendorExpense+totalMonthlyEmployeeExpense+totalMonthlyBasicExpense

    res.json({ totalProfit,totalIncome,totalExpense});

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};


//  yearly profit by shop
exports.yearlyProfitByShop= async (req, res) => {

  try {

    const shopId = req.params.shopId;
    if(!shopId){
        return res.status(404).json({ error: 'shop not found' });
    }

    const oneShop = await Shop.findById(shopId)
    const name = oneShop.name;
    const address = oneShop.address
    const contactInformation = oneShop.contactInformation

    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the year containing the queryDate
    const startOfYear = new Date(queryDate);
    startOfYear.setMonth(0, 1); // Move to the first day of January
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(startOfYear);
    endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Move to the first day of January of the next year
    endOfYear.setHours(0, 0, 0, 0);
    


    const basicExpenses = await BasicExpense.find({
      shopId: shopId,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const employeeExpenses = await EmployeeSalary.find({
      shopId: shopId,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const vendorExpenses = await VendorExpense.find({
      shopId: shopId,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const income = await Income.find({
      shopId: shopId,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const totalIncomeByShop = income.reduce((total, expense) => total + expense.amount, 0);

    const totalYearlyvendorExpenseByShop = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalYearlyemployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalYearlybasicExpenseByShop = basicExpenses.reduce((total, expense) => total + expense.amount, 0);

    const totalProfitByShop = totalIncomeByShop - (totalYearlyvendorExpenseByShop+totalYearlyemployeeExpenseByShop+totalYearlybasicExpenseByShop)
    const totalExpenseByShop = totalYearlyvendorExpenseByShop+totalYearlyemployeeExpenseByShop+totalYearlybasicExpenseByShop

    res.json({ totalProfitByShop,totalIncomeByShop,totalExpenseByShop,name,address,contactInformation });


  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Yearly profit
exports.yearlyProfit= async (req, res) => {
  try {
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Calculate the start and end dates for the year containing the queryDate
    const startOfYear = new Date(queryDate);
    startOfYear.setMonth(0, 1); // Move to the first day of January
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(startOfYear);
    endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Move to the first day of January of the next year
    endOfYear.setHours(0, 0, 0, 0);


    const basicExpenses = await BasicExpense.find({
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const employeeExpenses = await EmployeeSalary.find({
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const vendorExpenses = await VendorExpense.find({
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const income = await Income.find({
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const totalIncome = income.reduce((total, expense) => total + expense.amount, 0);

    const totalYearlyvendorExpense = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalYearlyemployeeExpense = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalYearlybasicExpense = basicExpenses.reduce((total, expense) => total + expense.amount, 0);

    const totalProfit = totalIncome - (totalYearlyvendorExpense+totalYearlyemployeeExpense+totalYearlybasicExpense)
    const totalExpense = totalYearlyvendorExpense+totalYearlyemployeeExpense+totalYearlybasicExpense

    res.json({ totalProfit,totalIncome,totalExpense });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};
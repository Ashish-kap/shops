const BasicExpense = require('../model/basicExpense.js');
const Income = require('../model/income.js');
const Shop = require('./../model/shop');
const VendorExpense = require('../model/vendor.js');
const EmployeeSalary = require('../model/employee.js');
const Employee = require('../model/registerEmployee.js');
const Vendor = require('../model/registerVendor.js');
const { Readable } = require("stream");
const PDFDocument = require('pdfkit');
let xlsx = require("json-as-xlsx")
//const { PDFDocument, rgb } = require('pdf-lib');
//const fs = require('fs');

exports.allBasicExpenses = async (req, res) => {
  try {
    const shopId = req.params.shopId
    const user = req.userr

    const startDate = req.query.start;
    const endDate = req.query.end;

    const expenseName = req.query.expenseName; 
    const forWhichEmployee = req.query.forWhichEmployee;

    let startTime, endTime;

    // Check if startDate and endDate are provided
    if (startDate && endDate) {
      // Set the start and end time for the queryDate (midnight to midnight)
      startTime = new Date(startDate);
      startTime.setHours(0, 0, 0, 0);
      endTime = new Date(endDate);
      endTime.setHours(23, 59, 59, 999);
    }

    const query = {
      shopId,
      userId: user._id,
    };

    // Add date filters only if both startDate and endDate are provided
    if (startTime && endTime) {
      query.date = { $gte: startTime, $lte: endTime };
    }

    // Add expenseName and forWhichEmployee to the query
    if (expenseName) {
      query.expenseName = expenseName;
    }

    if (forWhichEmployee) {
      query.forWhichEmployee = forWhichEmployee;
    }

    const basicExpenses = await BasicExpense.find(query);

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

    const vendorId = req.params.vendorId
    const user = req.userr


    const startDate = req.query.start;
    const endDate = req.query.end;

    const billNumber = req.query.billNumber; 
    const paymentStatus = req.query.paymentStatus;

    let startTime, endTime;

    // Check if startDate and endDate are provided
    if (startDate && endDate) {
      // Set the start and end time for the queryDate (midnight to midnight)
      startTime = new Date(startDate);
      startTime.setHours(0, 0, 0, 0);
      endTime = new Date(endDate);
      endTime.setHours(23, 59, 59, 999);
    }

    const query = {
      vendorId,
      userId: user._id,
    };

    // Add date filters only if both startDate and endDate are provided
    if (startTime && endTime) {
      query.date = { $gte: startTime, $lte: endTime };
    }

    // Add expenseName and forWhichEmployee to the query
    if (billNumber) {
      query.billNumber = billNumber;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    const vendorExpenses = await VendorExpense.find(query);

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
    // const shopId = req.params.shopId
    const employeeId = req.params.employeeId
    const user = req.userr
    const employeeExpenses = await EmployeeSalary.find({employeeId,userId:user._id });

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
    const user = req.userr

    const startDate = req.query.start;
    const endDate = req.query.end;

    const incomeSource = req.query.incomeSource; 
    const billNumber = req.query.billNumber;

    let startTime, endTime;

    // Check if startDate and endDate are provided
    if (startDate && endDate) {
      // Set the start and end time for the queryDate (midnight to midnight)
      startTime = new Date(startDate);
      startTime.setHours(0, 0, 0, 0);
      endTime = new Date(endDate);
      endTime.setHours(23, 59, 59, 999);
    }

    const query = {
      shopId,
      userId: user._id,
    };

    // Add date filters only if both startDate and endDate are provided
    if (startTime && endTime) {
      query.date = { $gte: startTime, $lte: endTime };
    }

    // Add incomeSource and billNumber to the query
    if (incomeSource) {
      query.incomeSource = incomeSource;
    }

    if (billNumber) {
      query.billNumber = billNumber;
    }

    const allIncomes = await Income.find(query);

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
    const user = req.userr;
    const startt = req.query.start;
    const endd = req.query.end;


    const response = await fetch(`https://sugarcan-shop.onrender.com/demo/${shopId}/${user._id}?start=${startt}&end=${endd}`);
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

      // res.setHeader('Content-Disposition', `attachment; filename="expenses_report`${startt}-${endd}`.pdf"`);
      res.setHeader('Content-Disposition', `attachment; filename="expenses_report_(${startt} to ${endd}).pdf"`);
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



exports.downloadExcel = async (req, res) => {
  try {

    const shopId = req.params.shopId;
    const user = req.userr;
    const startt = req.query.start;
    const endd = req.query.end;

    const response = await fetch(`https://sugarcan-shop.onrender.com/demo/${shopId}/${user._id}?start=${startt}&end=${endd}`);
    const responseData = await response.json();

    const data = [
      // employee
        {
        sheet: "All Employee",
        columns: [
          { label: "EMPLOYEE NAME", value: "name" },
          { label: "SALARY", value: "salary" },
          { label: "ADDRESS", value: "address" },
          { label: "BALANCE", value: "balanced" },
          { label: "PHONE NUMBER", value: "phoneNumber" },
        ],
        content: responseData.registerEmployee.map(employee => {
            return {
              name: employee.name,
              salary: employee.salary,
              address: employee.address,
              balanced: employee.balanced,
              phoneNumber: employee.phoneNumber,
            };
          }),
        },
      {
        sheet: "Employee Expenses",
        columns: [
            { label: "EMPLOYEE NAME", value: "name" },
            { label: "SALARY AMOUNT", value: "salaryAmount" },
            { label: "DATE", value: "date" },
            { label: "DESCRIPTION", value: "description" },
            { label: "PAYMENT METHOD", value: "paymentMethod" },
        ],
        
        content: responseData.registerEmployee.reduce((expenses, employee) => {
          return expenses.concat(employee.expenses.map(expense => {
            return {
              name: employee.name,
              salaryAmount: expense.salaryAmount,
              date: expense.date,
              description: expense.description,
              paymentMethod: expense.paymentMethod,
            };
          }));
        }, []),
      },

      // vendor

      {
        sheet: "All Vendors",
        columns: [
          { label: "VENDOR NAME", value: "vendorName" },
          { label: "ADDRESS", value: "address" },
          { label: "CONTACT INFORMATION", value: "contactInformation" },
        ],
        content: responseData.registerVendor,
      },

       {
        sheet: "Vendor Expenses",
        columns: [
            { label: "VENDOR NAME", value: "vendorName" },
            { label: "PRODUCT NAME", value: "productName" },
            { label: "DESCRIPTION", value: "description" },
            { label: "QUANTITY", value: "quantity" },
            { label: "BILL NUMBER", value: "billNumber" },
            { label: "DATE", value: "date" },
            { label: "AMOUNT", value: "amount" },
            { label: "PAYMENT DUE DATE", value: "paymentDueDate" },
            { label: "PAYMENT STATUS", value: "paymentStatus" },
        ],
        content: responseData.registerVendor.reduce((expenses, vendor) => {
          return expenses.concat(vendor.expenses.map(expense => {
            return {
              vendorName: vendor.vendorName,
              productName: expense.productName,
              description: expense.description,
              quantity: expense.quantity,
              billNumber: expense.billNumber,
              date: expense.date,
              amount: expense.amount,
              paymentDueDate: new Date(expense.paymentDueDate).toISOString().split('T')[0],
              paymentStatus: expense.paymentStatus,
              };
            }));
          }, []),
        },

      {
        sheet: "Basic Expenses",
        columns: [
            { label: "EXPENSE NAME", value: "expenseName" },
            { label: "AMOUNT", value: "amount" },
            { label: "DATE", value: "date" },
            { label: "DESCRIPTION", value: "description" },
        ],
        content: responseData.basicExpenses,
      },
      {
        sheet: "Income Data",
        columns: [
            { label: "AMOUNT", value: "amount" },
            { label: "DATE", value: "date" },
            { label: "BILL NUMBER", value: "billNumber" },
            { label: "DESCRIPTION", value: "description" },
            { label: "INCOME SOURCE", value: "incomeSource" },
            { label: "PRODUCT SOLD QUANTITY", value: "ProductSoldQuantity" },
        ],
        content: responseData.incomeData,
      },
      {
        sheet: "Shop Overview",
        columns: [
          { label: "SHOP NAME", value: "shopName" },
          { label: "TOTAL INCOME BY SHOP", value: "totalIncomeByShop" },
          { label: "TOTAL PROFIT BY SHOP", value: "totalProfitByShop" },
          { label: "TOTAL EXPENSE BY SHOP", value: "totalExpenseByShop" },
        ],
        content: [responseData], // Shop-level data
      },
    ];


    // Additional settings
    const settings = {
      writeOptions:{
        type: "buffer",
        bookType: "xlsx",
      },
    };


    console.log('Data Array:', data);

    const buffer = xlsx(data, settings);


    // Set the appropriate headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${responseData.shopName}_expenses_report_(${startt} to ${endd}).xlsx"`);

    // Send the Excel file as a response
    res.end(buffer);

    } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.demo = async (req, res) => {
  try {

    const shopId = req.params.shopId;
    const user = req.params.userId

    const startDate = req.query.start
    const endDate = req.query.end

    // Set the start and end time for the queryDate (midnight to midnight)
    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    const registerEmployee = await Employee.find({ userId:user});
    const registerVendor = await Vendor.find({userId:user});
    const basicExpenses = await BasicExpense.find({userId:user,shopId,date:{$gte:startTime,$lte:endTime } }).lean();;
    const vendorExpenses = await VendorExpense.find({userId:user,date: { $gte: startTime, $lte: endTime } }).lean();;
    const employeeExpenses = await EmployeeSalary.find({userId:user,date: { $gte: startTime, $lte: endTime } }).lean();;
    const incomeData = await Income.find({userId:user,shopId,date:{ $gte: startTime, $lte: endTime } }).lean();;

    const whichShop = await Shop.findOne({userId:user,_id:shopId});
    
    const shopName = whichShop.name

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
 
    // Map employee expenses to each employee
    const employeesWithExpenses = registerEmployee.map(employee => {
      const expenses = employeeExpenses.filter(expense => expense.employeeId.toString() === employee._id.toString());
      const formattedExpenses = expenses.map(expense => ({
        ...expense,
        date: formatDate(expense.date),
      }));
      return { ...employee.toObject(), expenses: formattedExpenses };
    });

    // Map vendor expenses to each vendor
    const vendorsWithExpenses = registerVendor.map(vendor => {
      const expenses = vendorExpenses.filter(expense => expense.vendorId.toString() === vendor._id.toString());
      const formattedExpenses = expenses.map(expense => ({
        ...expense,
        date: formatDate(expense.date)
      }));
      return { ...vendor.toObject(), expenses: formattedExpenses };
    });


    const totalIncomeByShop = incomeData.reduce((total, expense) => total + expense.amount, 0);

    const totalDailyVendorExpenseByShop = vendorExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalDailyEmployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total + expense.salaryAmount, 0);
    const totalDailyBasicExpenseByShop = basicExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalProfitByShop = totalIncomeByShop - (totalDailyVendorExpenseByShop +totalDailyEmployeeExpenseByShop+totalDailyBasicExpenseByShop)
    const totalExpenseByShop = totalDailyVendorExpenseByShop+totalDailyEmployeeExpenseByShop+totalDailyBasicExpenseByShop



    const formattedIncomeData = incomeData.map((income) => ({
      ...income,
      date: formatDate(income.date),
    }));


    const formattedBasicExpenses = basicExpenses.map((income) => ({
      ...income,
      date: formatDate(income.date),
    }));

    res.status(200).json({
      shopName,
      registerEmployee:employeesWithExpenses,
      registerVendor:vendorsWithExpenses,
      basicExpenses:formattedBasicExpenses,
      incomeData:formattedIncomeData,
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
    const user = req.userr

    // Set the start and end time for the queryDate (midnight to midnight)
    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    console.log("Parsed start date:", startTime);
    console.log("Parsed end date:", endTime);

    const basicExpenses = await BasicExpense.find({
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });

    const employeeExpenses = await EmployeeSalary.find({
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });

    const vendorExpenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });


    const income = await Income.find({
      userId:user._id,
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
    const user = req.userr
    if(!shopId){
        return res.status(404).json({ error: 'shop not found' });
    }

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
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });

    const employeeExpenses = await EmployeeSalary.find({
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });

    const vendorExpenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });


    const income = await Income.find({
      userId:user._id,
      shopId: shopId,
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
    const user = req.userr
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
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });

    const employeeExpenses = await EmployeeSalary.find({
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });

    const vendorExpenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });


    const income = await Income.find({
      shopId: shopId,
      userId:user._id,
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
    
    const user = req.userr
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Set the start and end time for the queryDate (midnight to midnight)
    const startTime = new Date(queryDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(queryDate);
    endTime.setHours(23, 59, 59, 999);

    const basicExpenses = await BasicExpense.find({
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });

    const employeeExpenses = await EmployeeSalary.find({
      userId:user._id,
      date: { $gte: startTime, $lte: endTime },
    });

    const vendorExpenses = await VendorExpense.find({
      date: { $gte: startTime, $lte: endTime },
      userId:user._id,
    });


    const income = await Income.find({
      date: { $gte: startTime, $lte: endTime },
      userId:user._id,
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
    const user = req.userr
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
      userId:user._id,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const employeeExpenses = await EmployeeSalary.find({
      // shopId: shopId,
      userId:user._id,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const vendorExpenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });


    const income = await Income.find({
      shopId: shopId,
      userId:user._id,
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
    const user = req.userr
    // Calculate the start and end dates for the week containing the queryDate
    const startOfWeek = new Date(queryDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Move to the beginning of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to the end of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);

    const basicExpenses = await BasicExpense.find({
      userId:user._id,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const employeeExpenses = await EmployeeSalary.find({
      userId:user._id,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const vendorExpenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });


    const income = await Income.find({
      userId:user._id,
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
    const user = req.userr
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
      userId:user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const employeeExpenses = await EmployeeSalary.find({
      // shopId: shopId,
      userId:user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const vendorExpenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });


    const income = await Income.find({
      shopId: shopId,
      userId:user._id,
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


    const basicExpenses = await BasicExpense.find({
      userId:user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const employeeExpenses = await EmployeeSalary.find({
      userId:user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const vendorExpenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });


    const income = await Income.find({
      userId:user._id,
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

    const user = req.userr
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
      userId:user._id,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const employeeExpenses = await EmployeeSalary.find({
      // shopId: shopId,
      userId:user._id,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const vendorExpenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const income = await Income.find({
      shopId: shopId,
      userId:user._id,
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
    const user = req.userr
    // Calculate the start and end dates for the year containing the queryDate
    const startOfYear = new Date(queryDate);
    startOfYear.setMonth(0, 1); // Move to the first day of January
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(startOfYear);
    endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Move to the first day of January of the next year
    endOfYear.setHours(0, 0, 0, 0);


    const basicExpenses = await BasicExpense.find({
      userId:user._id,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const employeeExpenses = await EmployeeSalary.find({
      userId:user._id,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const vendorExpenses = await VendorExpense.find({
      userId:user._id,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const income = await Income.find({
      userId:user._id,
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
let xlsx = require("json-as-xlsx")
const dateUtils = require('./dateUtils');
const BaseUrl = `https://erp.manifestsolution.com`
// const BaseUrl = `http://localhost:3000`
const puppeteer = require('puppeteer');



const path = require('path');
const ejs = require('ejs');

const createDbConnection = require('./db'); 
const connection = createDbConnection();


exports.allBasicExpenses = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const user = req.userr;

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

    // Construct the SQL query based on the provided parameters
    let query = 'SELECT * FROM basic_expenses WHERE shopId = ? AND userId = ?';
    const queryParams = [shopId, user.id];

    // Add date filters only if both startDate and endDate are provided
    if (startTime && endTime) {
      query += ' AND date BETWEEN ? AND ?';
      queryParams.push(startTime, endTime);
    }

    // Add expenseName and forWhichEmployee to the query
    if (expenseName) {
      query += ' AND expenseName = ?';
      queryParams.push(expenseName);
    }

    if (forWhichEmployee) {
      query += ' AND forWhichEmployee = ?';
      queryParams.push(forWhichEmployee);
    }

    // Execute the SQL query
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      res.status(200).json({ allExpenses: results });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// exports.allVendorExpenses = async (req, res) => {
//   try {

//     const vendorId = req.params.vendorId
//     const user = req.userr


//     const startDate = req.query.start;
//     const endDate = req.query.end;

//     const billNumber = req.query.billNumber; 
//     const paymentStatus = req.query.paymentStatus;

//     let startTime, endTime;

//     // Check if startDate and endDate are provided
//     if (startDate && endDate) {
//       // Set the start and end time for the queryDate (midnight to midnight)
//       startTime = new Date(startDate);
//       startTime.setHours(0, 0, 0, 0);
//       endTime = new Date(endDate);
//       endTime.setHours(23, 59, 59, 999);
//     }

//     const query = {
//       vendorId,
//       userId: user._id,
//     };

//     // Add date filters only if both startDate and endDate are provided
//     if (startTime && endTime) {
//       query.date = { $gte: startTime, $lte: endTime };
//     }

//     // Add expenseName and forWhichEmployee to the query
//     if (billNumber) {
//       query.billNumber = billNumber;
//     }

//     if (paymentStatus) {
//       query.paymentStatus = paymentStatus;
//     }
    
//     const vendorExpenses = await VendorExpense.find(query);

//     const vendor= await Vendor.findById(vendorId)

//     const allExpenses = [...vendorExpenses];

//     allExpenses.sort((a, b) => b.createdAt - a.createdAt);
//     res.status(200).json({ vendor,allExpenses });

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


exports.allVendorExpenses = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const user = req.userr;

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

    // Construct the SQL query based on the filters
    let query = 'SELECT * FROM vendor_expense WHERE vendorId = ? AND userId = ?';

    const queryParams = [vendorId, user.id];

    if (startTime && endTime) {
      query += ' AND date >= ? AND date <= ?';
      queryParams.push(startTime, endTime);
    }

    if (billNumber) {
      query += ' AND billNumber = ?';
      queryParams.push(billNumber);
    }

    if (paymentStatus) {
      query += ' AND paymentStatus = ?';
      queryParams.push(paymentStatus);
    }

    // Execute the SQL query
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      const vendorExpenses = results;

      connection.query('SELECT * FROM vendor WHERE id = ?', [vendorId], (error, vendorResult) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        if (vendorResult.length === 0) {
          return res.status(404).json({ status: 'failed', message: 'Vendor not found' });
        }

        const vendor = vendorResult[0];
        res.status(200).json({ vendor, allExpenses: vendorExpenses });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.allEmployeeExpenses = async (req, res) => {
  try {

    const employeeId = req.params.employeeId;
    const user = req.userr;

    const startDate = req.query.start;
    const endDate = req.query.end;

    let startTime, endTime;

    // Check if startDate and endDate are provided
    if (startDate && endDate) {
      // Set the start and end time for the queryDate (midnight to midnight)
      startTime = new Date(startDate);
      startTime.setHours(0, 0, 0, 0);
      endTime = new Date(endDate);
      endTime.setHours(23, 59, 59, 999);
    }

    
    let query = 'SELECT * FROM employee_salary WHERE employeeId = ? AND userId = ?';
    const queryParams = [employeeId, user.id]

    if (startTime && endTime) {
      query += ' AND date BETWEEN ? AND ?';
      queryParams.push(startTime, endTime);
    }

    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.log(error)
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      const employeeExpenses = results;

      connection.query('SELECT * FROM employee WHERE id = ?', [employeeId], (error, employeeResult) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        if (employeeResult.length === 0) {
          return res.status(404).json({ status: 'failed', message: 'Employee not found' });
        }

        const employee = employeeResult[0];
        res.status(200).json({ employee, allExpenses: employeeExpenses });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.allIncome = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const user = req.userr;

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

    let query = 'SELECT * FROM income WHERE shopId = ? AND userId = ?';

    const queryParams = [shopId, user.id];

    // Add date filters only if both startDate and endDate are provided
    if (startTime && endTime) {
      query += ' AND date BETWEEN ? AND ?';
      queryParams.push(startTime, endTime);
    }

    // Add incomeSource and billNumber to the query
    if (incomeSource) {
      query += ' AND incomeSource = ?';
      queryParams.push(incomeSource);
    }

    if (billNumber) {
      query += ' AND billNumber = ?';
      queryParams.push(billNumber);
    }

    connection.query(query, queryParams, (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      const allIncome = results;
      res.status(200).json({ allIncome });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.downloadExcel = async (req, res) => {
  try {

    const shopId = req.query.shopId;
    const user = req.userr.id;

    const startt = req.query.start;
    const endd = req.query.end;

    const employeeId = req.query.employeeId;
    const vendorId = req.query.vendorId;
    
    const dataType = req.query.type;

    const startTime = new Date(startt);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(endd);
    endTime.setHours(23, 59, 59, 999);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Retrieve data from MySQL tables
    if(shopId){
      var shop = await query('SELECT * FROM shops WHERE id = ?', [shopId]);
      var shopName = shop[0].name
    }
    
    // employee
    let registerEmployee;
    if (employeeId) {
      registerEmployee = await query('SELECT * FROM employee WHERE userId = ? AND id = ?', [user, employeeId]);
    } else {
      registerEmployee = await query('SELECT * FROM employee WHERE userId = ?', [user]);
    }


    // employee expense
    const queryParamsEmployeeExpense = [user, startTime, endTime];
    let employeeExpenses;
    if (employeeId) {
      queryParamsEmployeeExpense.push(employeeId);
      employeeExpenses = await query('SELECT * FROM employee_salary WHERE userId = ? AND date BETWEEN ? AND ? AND employeeId = ?', queryParamsEmployeeExpense);
    } else {
      employeeExpenses = await query('SELECT * FROM employee_salary WHERE userId = ? AND date BETWEEN ? AND ?', queryParamsEmployeeExpense);
    }


    // vendor
     let registerVendor;
    if (vendorId) {
      registerVendor = await query('SELECT * FROM vendor WHERE userId = ? AND id = ?', [user, vendorId]);
    } else {
      registerVendor = await query('SELECT * FROM vendor WHERE userId = ?', [user]);
    }


    // vendor expense
    const queryParamsVendorExpense = [user, startTime, endTime];
    let vendorExpenses;
    if (vendorId) {
      vendorExpenses = await query('SELECT * FROM vendor_expense WHERE userId = ? AND date BETWEEN ? AND ? AND vendorId = ?', [...queryParamsVendorExpense, vendorId]);
    } else {
      vendorExpenses = await query('SELECT * FROM vendor_expense WHERE userId = ? AND date BETWEEN ? AND ?', queryParamsVendorExpense);
    }



    const queryParamsBasicExpenses = [user, startTime, endTime];
    let basicExpenses;
    if (shopId) {
      basicExpenses = await query('SELECT * FROM basic_expenses WHERE userId = ? AND shopId = ?', [user, shopId]);
    }else if(shopId && startTime && endTime){
      basicExpenses = await query('SELECT * FROM basic_expenses WHERE userId = ? AND shopId = ? AND date BETWEEN ? AND ?', [user, shopId,startTime, endTime]);
    }else if(startTime && endTime){
      basicExpenses = await query('SELECT * FROM basic_expenses WHERE userId = ?', [user]);
    }else {
      basicExpenses = await query('SELECT * FROM basic_expenses WHERE userId = ? AND date BETWEEN ? AND ?', queryParamsBasicExpenses);
    }


    const queryParamsIncomeData = [user, startTime, endTime];
    let incomeData;
    if (shopId) {
      incomeData = await query('SELECT * FROM income WHERE userId = ? AND shopId = ? ', [user, shopId]);
    }else if(shopId && startTime && endTime){
      incomeData = await query('SELECT * FROM income WHERE userId = ? AND shopId = ? AND date BETWEEN ? AND ?', [user, shopId,startTime, endTime]);
    }else if(startTime && endTime){
      incomeData = await query('SELECT * FROM income WHERE userId = ?', [user]);
    }else {
      incomeData = await query('SELECT * FROM income WHERE userId = ? AND date BETWEEN ? AND ?', queryParamsIncomeData);
    }

    const employeesWithExpenses = registerEmployee.map(employee => {
      const expenses = employeeExpenses.filter(expense => expense.employeeId.toString() === employee.id.toString());
      const formattedExpenses = expenses.map(expense => ({
        ...expense,
        date: formatDate(expense.date),
      }));

      const formattedJoinDate = formatDate(employee.joinDate);

      return { ...employee, expenses: formattedExpenses,joinDate: formattedJoinDate};
    });


    // Map vendor expenses to each vendor
    const vendorsWithExpenses = registerVendor.map(vendor => {
      const expenses = vendorExpenses.filter(expense => expense.vendorId.toString() === vendor.id.toString());
      const formattedExpenses = expenses.map(expense => ({
        ...expense,
        date: formatDate(expense.date)
      }));
      return { ...vendor, expenses: formattedExpenses };
    });


    const basicWithExpenses = basicExpenses.map(employee => {
      const formattedJoinDate = formatDate(employee.date);
      return { ...employee,date: formattedJoinDate};
    });

    const incomeWithExpenses = incomeData.map(employee => {
      const formattedJoinDate = formatDate(employee.date);
      return { ...employee,date: formattedJoinDate};
    });

    // Calculate total income, expenses, and profit
    const totalIncomeByShop = incomeData.reduce((total, income) => total + parseInt(income.amount), 0);
    const totalDailyVendorExpenseByShop = vendorExpenses.reduce((total, expense) => total + parseInt(expense.amount), 0);
    const totalDailyEmployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total + parseInt(expense.salaryAmount), 0);
    const totalDailyBasicExpenseByShop = basicExpenses.reduce((total, expense) => total + parseInt(expense.amount), 0);
    const totalProfitByShop = parseInt(totalIncomeByShop) - (parseInt(totalDailyVendorExpenseByShop) + parseInt(totalDailyEmployeeExpenseByShop) + parseInt(totalDailyBasicExpenseByShop));
    const totalExpenseByShop = totalDailyVendorExpenseByShop + totalDailyEmployeeExpenseByShop + totalDailyBasicExpenseByShop;

    
    let responseData = {
      shopName: "" || shopName,
    };

    switch (dataType) {
      case 'employeesWithExpenses':
        responseData.registerEmployee = employeesWithExpenses;
        break;
      case 'vendorsWithExpenses':
        responseData.registerVendor = vendorsWithExpenses;
        break;
      case 'basicWithExpenses':
        responseData.basicExpenses = basicWithExpenses;
        break;
      case 'incomeWithExpenses':
        responseData.incomeData = incomeWithExpenses;
        break;
      default:
        responseData = {
          ...responseData,
          registerEmployee: employeesWithExpenses,
          registerVendor: vendorsWithExpenses,
          basicExpenses: basicWithExpenses,
          incomeData: incomeWithExpenses,
        };
    }

    responseData.totalIncomeByShop = totalIncomeByShop;
    responseData.totalProfitByShop = totalProfitByShop;
    responseData.totalExpenseByShop = totalExpenseByShop;

  
    // const templatePath = path.join(__dirname, 'templates', 'template.ejs');
    // const htmlTemplate = await ejs.renderFile(templatePath, { info: responseData });

    // const browser = await puppeteer.launch({ headless: 'new' });
    // const page = await browser.newPage();

    // await page.setContent(htmlTemplate, { waitUntil: 'domcontentloaded' });

    // // Generate PDF
    // const pdfOptions = {
    //   format: 'Letter',
    // };

    // const pdfBuffer = await page.pdf(pdfOptions);

    // await browser.close();

    // res.attachment('output.pdf');
    // res.type('application/pdf');
    // res.send(pdfBuffer);

    const templatePath = path.join(__dirname, 'templates', 'template.ejs');
    const htmlTemplate = await ejs.renderFile(templatePath, { info: responseData });

    const pdfOptions = {
      format: 'Letter',
    };

    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(htmlTemplate, { waitUntil: 'domcontentloaded' });

    // Generate PDF
    const pdfBuffer = await page.pdf(pdfOptions);

    // Close the browser
    await browser.close();

    // Set response headers for file download
    res.attachment('output.pdf');
    res.type('application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



exports.downloadPdf =async (req, res) => {
  try {
    const jsonData = {
    "shopName": "smart shop",
    "registerEmployee": [
        {
            "id": 1,
            "name": "Ashish",
            "shopName": "smart shop",
            "joinDate": "2023-10-26",
            "salary": "90290.00",
            "address": "Thane",
            "balanced": "88390.00",
            "phoneNumber": "5476575679",
            "userId": 5,
            "expenses": [
                {
                    "id": 5,
                    "salaryAmount": "1900.00",
                    "date": "2023-11-04",
                    "whichMonthSalary": "February-March",
                    "description": "salary day",
                    "paymentMethod": "Google Pay/Phone Pe/Paytm",
                    "createdAt": "2023-11-03T20:04:00.000Z",
                    "userId": 5,
                    "employeeId": 1
                }
            ]
        },
    ],
    "totalIncomeByShop": 8800,
    "totalProfitByShop": 3891,
    "totalExpenseByShop": 4909
  }

    // // Define the HTML template
    // const templatePath = path.join(__dirname, 'templates', 'template.ejs');  // Specify the path to your HTML template file
    // const htmlTemplate = await ejs.renderFile(templatePath, { info: jsonData });
    // // Define PDF options
    // const pdfOptions = { format: 'Letter' };
    // // Convert HTML to PDF
    // pdf.create(htmlTemplate, pdfOptions).toFile('./downloads/output.pdf', (err, result) => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(500).send('Error generating PDF');
    //   }
    //   res.sendFile(result.filename);
    // });

    async function generatePDF() {
      const templatePath = path.join(__dirname, 'templates', 'template.ejs');
      const htmlTemplate = await ejs.renderFile(templatePath, { info: responseData });

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set the HTML content of the page
      await page.setContent(htmlTemplate, { waitUntil: 'domcontentloaded' });

      // Generate PDF
      const pdfOptions = {
        path: './downloads/output.pdf',
        format: 'Letter',
      };

      await page.pdf(pdfOptions);

      await browser.close();
    }

    generatePDF().catch(error => {
      console.error(error);
      res.status(500).send('Error generating PDF');
    });


  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};


exports.demo = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const user = req.params.userId;
    const startDate = req.query.start;
    const endDate = req.query.end;

    // Set the start and end time for the queryDate (midnight to midnight)
    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

      const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Retrieve data from MySQL tables
    const shop = await query('SELECT * FROM shops WHERE id = ?', [shopId]);
    console.log(shop)
    const registerEmployee = await query('SELECT * FROM employee WHERE userId = ?', [user]);
    const registerVendor = await query('SELECT * FROM vendor WHERE userId = ?', [user]);
    const basicExpenses = await query('SELECT * FROM basic_expenses WHERE userId = ? AND shopId = ? AND date BETWEEN ? AND ?', [user, shopId, startTime, endTime]);
    const vendorExpenses = await query('SELECT * FROM vendor_expense WHERE userId = ? AND date BETWEEN ? AND ?', [user, startTime, endTime]);
    const employeeExpenses = await query('SELECT * FROM employee_salary WHERE userId = ? AND date BETWEEN ? AND ?', [user, startTime, endTime]);
    const incomeData = await query('SELECT * FROM income WHERE userId = ? AND shopId = ? AND date BETWEEN ? AND ?', [user, shopId, startTime, endTime]);

     const employeesWithExpenses = registerEmployee.map(employee => {
      const expenses = employeeExpenses.filter(expense => expense.employeeId.toString() === employee.id.toString());
      const formattedExpenses = expenses.map(expense => ({
        ...expense,
        date: formatDate(expense.date),
      }));
      const formattedJoinDate = formatDate(employee.joinDate);

      return { ...employee, expenses: formattedExpenses,joinDate: formattedJoinDate};
    });

    // Map vendor expenses to each vendor
    const vendorsWithExpenses = registerVendor.map(vendor => {
      const expenses = vendorExpenses.filter(expense => expense.vendorId.toString() === vendor.id.toString());
      const formattedExpenses = expenses.map(expense => ({
        ...expense,
        date: formatDate(expense.date)
      }));
      return { ...vendor, expenses: formattedExpenses };
    });

    // Calculate total income, expenses, and profit
    const totalIncomeByShop = incomeData.reduce((total, income) => total + parseInt(income.amount), 0);
    console.log(incomeData)
    const totalDailyVendorExpenseByShop = vendorExpenses.reduce((total, expense) => total + parseInt(expense.amount), 0);
    const totalDailyEmployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total + parseInt(expense.salaryAmount), 0);
    const totalDailyBasicExpenseByShop = basicExpenses.reduce((total, expense) => total + parseInt(expense.amount), 0);
    const totalProfitByShop = parseInt(totalIncomeByShop) - (parseInt(totalDailyVendorExpenseByShop) + parseInt(totalDailyEmployeeExpenseByShop) + parseInt(totalDailyBasicExpenseByShop));
    const totalExpenseByShop = totalDailyVendorExpenseByShop + totalDailyEmployeeExpenseByShop + totalDailyBasicExpenseByShop;

    res.status(200).json({
      shopName:shop[0].name,
      registerEmployee:employeesWithExpenses,
      registerVendor:vendorsWithExpenses,
      basicExpenses,
      incomeData,
      totalIncomeByShop,
      totalProfitByShop,
      totalExpenseByShop,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.selectPeriod = async (req, res) => {
  try {
    const startDate = req.query.start;
    const endDate = req.query.end;
    const user = req.userr;

    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    const getBasicExpensesQuery = `
      SELECT *
      FROM basic_expenses
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getEmployeeExpensesQuery = `
      SELECT *
      FROM employee_salary
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getVendorExpensesQuery = `
      SELECT *
      FROM vendor_expense
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getIncomeQuery = `
      SELECT *
      FROM income
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const totalCash =`SELECT SUM(amount) AS totalCashAmount FROM income WHERE incomeSource = 'CASH' AND userId = ? AND date BETWEEN ? AND ?`

    const totalGpay =  `
    SELECT incomeSource, SUM(amount) AS totalGpayAmount
    FROM income
    WHERE (incomeSource = 'Bank Transfer' OR incomeSource LIKE '%Google Pay%' OR incomeSource LIKE '%Paytm%' OR incomeSource LIKE '%Phone Pe%')
      AND userId = ?
      AND date BETWEEN ? AND ?
    GROUP BY incomeSource
  `;

    connection.query(getBasicExpensesQuery, [user.id, startTime, endTime], (error1, basicExpenses) => {
      if (error1) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      connection.query(getEmployeeExpensesQuery, [user.id, startTime, endTime], (error2, employeeExpenses) => {
        if (error2) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        connection.query(getVendorExpensesQuery, [user.id, startTime, endTime], (error3, vendorExpenses) => {
          if (error3) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error. Please try again later.',
            });
          }

          connection.query(getIncomeQuery, [user.id, startTime, endTime], (error4, income) => {
            if (error4) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

          connection.query(totalCash, [user.id, startTime, endTime], (error5, totalCashh) => {
            if (error5) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

            connection.query(totalGpay, [user.id, startTime, endTime], (error6, totalGpay) => {
              if (error6) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                let totalBankTransferAmount = 0;
                let totalGpayAmount = 0;

                totalGpay.forEach((row) => {
                  if (row.incomeSource === 'Bank Transfer') {
                    totalBankTransferAmount = row.totalGpayAmount;
                  } else {
                    totalGpayAmount += row.totalGpayAmount;
                  }
                });

                const totalGGpay = parseInt(totalGpayAmount)+parseInt(totalBankTransferAmount)

                // const totalIncome = income.reduce((total, expense) => total +parseInt(expense.amount), 0);
                const totalDailyVendorExpense = vendorExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
                const totalDailyEmployeeExpense = employeeExpenses.reduce((total, expense) => total +parseInt(expense.salaryAmount), 0);
                const totalDailyBasicExpense = basicExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
                // const totalProfit = parseInt(totalIncome) - (parseInt(totalDailyVendorExpense) + parseInt(totalDailyEmployeeExpense) + parseInt(totalDailyBasicExpense));
                const totalExpense = parseInt(totalDailyVendorExpense) + parseInt(totalDailyEmployeeExpense) + parseInt(totalDailyBasicExpense);

                res.json({ totalProfit:parseInt(totalCashh[0].totalCashAmount ?? 0), totalIncome:totalGGpay, totalExpense });

              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.selectPeriodForShop = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const user = req.userr;

    console.log(user)

    if (!shopId) {
      return res.status(404).json({ error: 'shop not found' });
    }

    const startDate = req.query.start;
    const endDate = req.query.end;

    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    const getBasicExpensesQuery = `
      SELECT *
      FROM basic_expenses
      WHERE shopId = ? AND userId = ? AND date BETWEEN ? AND ?
    `;

    const getEmployeeExpensesQuery = `
      SELECT *
      FROM employee_salary
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getVendorExpensesQuery = `
      SELECT *
      FROM vendor_expense
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getIncomeQuery = `
      SELECT *
      FROM income
      WHERE shopId = ? AND userId = ? AND date BETWEEN ? AND ?
    `;


    const totalCash =`SELECT SUM(amount) AS totalCashAmount FROM income WHERE incomeSource = 'CASH' AND shopId = ? AND userId = ? AND date BETWEEN ? AND ?`

    const totalGpay =  `
    SELECT incomeSource, SUM(amount) AS totalGpayAmount
    FROM income
    WHERE (incomeSource = 'Bank Transfer' OR incomeSource LIKE '%Google Pay%' OR incomeSource LIKE '%Paytm%' OR incomeSource LIKE '%Phone Pe%')
      AND shopId = ?
      AND userId = ?
      AND date BETWEEN ? AND ?
    GROUP BY incomeSource
  `;

    connection.query(getBasicExpensesQuery, [shopId, user.id, startTime, endTime], (error1, basicExpenses) => {
      if (error1) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      connection.query(getEmployeeExpensesQuery, [user.id, startTime, endTime], (error2, employeeExpenses) => {
        if (error2) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        connection.query(getVendorExpensesQuery, [user.id, startTime, endTime], (error3, vendorExpenses) => {
          if (error3) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error. Please try again later.',
            });
          }

          connection.query(getIncomeQuery, [shopId, user.id, startTime, endTime], (error4, income) => {
            if (error4) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

          connection.query(totalCash, [shopId, user.id, startTime, endTime], (error5, totalCashh) => {
            if (error5) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

            connection.query(totalGpay, [shopId, user.id, startTime, endTime], (error6, totalGpay) => {
              if (error6) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                let totalBankTransferAmount = 0;
                let totalGpayAmount = 0;

                totalGpay.forEach((row) => {
                  if (row.incomeSource === 'Bank Transfer') {
                    totalBankTransferAmount = row.totalGpayAmount;
                  } else {
                    totalGpayAmount += row.totalGpayAmount;
                  }
                });

                const totalGGpay = parseInt(totalGpayAmount)+parseInt(totalBankTransferAmount)
       

                // const totalIncome = income.reduce((total, expense) => total +parseInt(expense.amount), 0);
                const totalDailyVendorExpense = vendorExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
                const totalDailyEmployeeExpense = employeeExpenses.reduce((total, expense) => total +parseInt(expense.salaryAmount), 0);
                const totalDailyBasicExpense = basicExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
                // const totalProfit = parseInt(totalIncome) - (parseInt(totalDailyVendorExpense) + parseInt(totalDailyEmployeeExpense) + parseInt(totalDailyBasicExpense));
                const totalExpense = parseInt(totalDailyVendorExpense) + parseInt(totalDailyEmployeeExpense) + parseInt(totalDailyBasicExpense);

                res.json({ totalProfit:parseInt(totalCashh[0].totalCashAmount ?? 0), totalIncome:totalGGpay, totalExpense });
              })
            });
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.dailyProfitByShop = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const user = req.userr;

    console.log(user)

    const userId = user.id

    if (!shopId) {
      return res.status(404).json({ error: 'shop not found' });
    }

    // Query the Shop data
    const shopQuery = `SELECT * FROM shops WHERE userId = ? AND id = ?`;
    const totalCash =`SELECT SUM(amount) AS totalCashAmount FROM income WHERE incomeSource = 'CASH' AND shopId = ? AND userId = ? AND date BETWEEN ? AND ?`
    const totalGpay =  `
    SELECT incomeSource, SUM(amount) AS totalGpayAmount
    FROM income
    WHERE (incomeSource = 'Bank Transfer' OR incomeSource LIKE '%Google Pay%' OR incomeSource LIKE '%Paytm%' OR incomeSource LIKE '%Phone Pe%')
      AND shopId = ?
      AND userId = ?
      AND date BETWEEN ? AND ?
    GROUP BY incomeSource
  `;
    connection.query(shopQuery, [userId, shopId], (shopError, shopData) => {
      if (shopError) {
        console.log(shopError)
        return res.status(500).json({
          status: 'error',
          message: 'Error fetching shop data from the database.',
        });
      }

      if (shopData.length === 0) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      const oneShop = shopData[0];
      const name = oneShop.name;
      const address = oneShop.address;
      const contactInformation = oneShop.contactInformation;

      const queryDate = req.query.date ? new Date(req.query.date) : new Date();

      // Set the start and end time for the queryDate (midnight to midnight)
      const startTime = new Date(queryDate);
      startTime.setHours(0, 0, 0, 0);
      const endTime = new Date(queryDate);
      endTime.setHours(23, 59, 59, 999);

      const getBasicExpensesQuery = `
        SELECT *
        FROM basic_expenses
        WHERE shopId = ? AND userId = ? AND date BETWEEN ? AND ?
      `;

      const getEmployeeExpensesQuery = `
        SELECT *
        FROM employee_salary
        WHERE userId = ? AND date BETWEEN ? AND ?
      `;

      const getVendorExpensesQuery = `
        SELECT *
        FROM vendor_expense
        WHERE userId = ? AND date BETWEEN ? AND ?
      `;

      const getIncomeQuery = `
        SELECT *
        FROM income
        WHERE shopId = ? AND userId = ? AND date BETWEEN ? AND ?
      `;

      connection.query(getBasicExpensesQuery, [shopId, userId, startTime, endTime], (error1, basicExpenses) => {
        console.log(basicExpenses)
        if (error1) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        // connection.query(getEmployeeExpensesQuery, [user.id, startTime, endTime], (error2, employeeExpenses) => {
        //   if (error2) {
        //     return res.status(500).json({
        //       status: 'error',
        //       message: 'Database error. Please try again later.',
        //     });
        //   }

        // connection.query(getVendorExpensesQuery, [user.id, startTime, endTime], (error3, vendorExpenses) => {
        //     if (error3) {
        //       return res.status(500).json({
        //         status: 'error',
        //         message: 'Database error. Please try again later.',
        //       });
        //     }

            connection.query(getIncomeQuery, [shopId, user.id, startTime, endTime], (error4, income) => {
              if (error4) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }


          connection.query(totalCash, [shopId, user.id, startTime, endTime], (error5, totalCashh) => {
            if (error5) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }


            connection.query(totalGpay, [shopId, user.id, startTime, endTime], (error6, totalGpay) => {
              if (error6) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                let totalBankTransferAmount = 0;
                let totalGpayAmount = 0;

                totalGpay.forEach((row) => {
                  if (row.incomeSource === 'Bank Transfer') {
                    totalBankTransferAmount = row.totalGpayAmount;
                  } else {
                    totalGpayAmount += row.totalGpayAmount;
                  }
                });

              const totalGGpay = parseInt(totalGpayAmount)+parseInt(totalBankTransferAmount)
       

              const totalIncomeByShop = income.reduce((total, expense) => total +parseInt(expense.amount), 0);
              // const totalDailyVendorExpenseByShop = vendorExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
              // const totalDailyEmployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total +parseInt(expense.salaryAmount), 0);
              const totalDailyBasicExpenseByShop = basicExpenses.reduce((total, expense) => total+parseInt(expense.amount), 0);
              
              // const totalProfitByShop = parseInt(totalIncomeByShop) - (parseInt(totalDailyVendorExpenseByShop) + parseInt(totalDailyEmployeeExpenseByShop) + parseInt(totalDailyBasicExpenseByShop));
              // const totalExpenseByShop = parseInt(totalDailyVendorExpenseByShop) + parseInt(totalDailyEmployeeExpenseByShop) + parseInt(totalDailyBasicExpenseByShop);

              console.log(totalDailyBasicExpenseByShop)
              const totalProfitByShop = parseInt(totalIncomeByShop)-(parseInt(totalDailyBasicExpenseByShop));
              const totalExpenseByShop=parseInt(totalDailyBasicExpenseByShop);


              res.json({ totalProfitByShop:parseInt(totalCashh[0].totalCashAmount ?? 0), totalIncomeByShop:totalGGpay, totalExpenseByShop, name, address, contactInformation });
            });
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




// exports.dailyProfit= async (req, res) => {
//   try {
    
//     const user = req.userr
//     const queryDate = req.query.date ? new Date(req.query.date) : new Date();

//     // Set the start and end time for the queryDate (midnight to midnight)
//     const startTime = new Date(queryDate);
//     startTime.setHours(0, 0, 0, 0);
//     const endTime = new Date(queryDate);
//     endTime.setHours(23, 59, 59, 999);

//     const basicExpenses = await BasicExpense.find({
//       userId:user._id,
//       date: { $gte: startTime, $lte: endTime },
//     });

//     const employeeExpenses = await EmployeeSalary.find({
//       userId:user._id,
//       date: { $gte: startTime, $lte: endTime },
//     });

//     const vendorExpenses = await VendorExpense.find({
//       date: { $gte: startTime, $lte: endTime },
//       userId:user._id,
//     });


//     const income = await Income.find({
//       date: { $gte: startTime, $lte: endTime },
//       userId:user._id,
//     });

//     const totalIncome = income.reduce((total, expense) => total +parseInt(expense.amount), 0);

//     const totalDailyVendorExpense = vendorExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
//     const totalDailyEmployeeExpense = employeeExpenses.reduce((total, expense) => total +parseInt(expense.salaryAmount), 0);
//     const totalDailyBasicExpense = basicExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
//     const totalProfit = totalIncome - (totalDailyVendorExpense +totalDailyEmployeeExpense+totalDailyBasicExpense)
//     const totalExpense = totalDailyVendorExpense+totalDailyEmployeeExpense+totalDailyBasicExpense

//     res.json({ totalProfit,totalIncome,totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };



exports.dailyProfit = async (req, res) => {
  try {
    const user = req.userr;
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    // Set the start and end time for the queryDate (midnight to midnight)
    const startTime = new Date(queryDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(queryDate);
    endTime.setHours(23, 59, 59, 999);

    const getBasicExpensesQuery = `
      SELECT *
      FROM basic_expenses
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getEmployeeExpensesQuery = `
      SELECT *
      FROM employee_salary
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getVendorExpensesQuery = `
      SELECT *
      FROM vendor_expense
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getIncomeQuery = `
      SELECT *
      FROM income
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const totalCash =`SELECT SUM(amount) AS totalCashAmount FROM income WHERE incomeSource = 'CASH' AND userId = ? AND date BETWEEN ? AND ?`

    const totalGpay =  `
    SELECT incomeSource, SUM(amount) AS totalGpayAmount
    FROM income
    WHERE (incomeSource = 'Bank Transfer' OR incomeSource LIKE '%Google Pay%' OR incomeSource LIKE '%Paytm%' OR incomeSource LIKE '%Phone Pe%')
      AND userId = ?
      AND date BETWEEN ? AND ?
    GROUP BY incomeSource
  `;

    connection.query(getBasicExpensesQuery, [user.id, startTime, endTime], (error1, basicExpenses) => {
      if (error1) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      connection.query(getEmployeeExpensesQuery, [user.id, startTime, endTime], (error2, employeeExpenses) => {
        if (error2) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        connection.query(getVendorExpensesQuery, [user.id, startTime, endTime], (error3, vendorExpenses) => {
          if (error3) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error. Please try again later.',
            });
          }

          connection.query(getIncomeQuery, [user.id, startTime, endTime], (error4, income) => {
            if (error4) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

          connection.query(totalCash, [user.id, startTime, endTime], (error5, totalCashh) => {
            if (error5) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

            connection.query(totalGpay, [user.id, startTime, endTime], (error6, totalGpay) => {
              if (error6) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                let totalBankTransferAmount = 0;
                let totalGpayAmount = 0;

                totalGpay.forEach((row) => {
                  if (row.incomeSource === 'Bank Transfer') {
                    totalBankTransferAmount = row.totalGpayAmount;
                  } else {
                    totalGpayAmount += row.totalGpayAmount;
                  }
                });

                const totalGGpay = parseInt(totalGpayAmount)+parseInt(totalBankTransferAmount)
       

            const totalIncome = income.reduce((total, expense) => total + parseInt(expense.amount), 0);
            const totalDailyVendorExpense = vendorExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
            const totalDailyEmployeeExpense = employeeExpenses.reduce((total, expense) => total + parseInt(expense.salaryAmount), 0);
            const totalDailyBasicExpense = basicExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
            const totalProfit = parseInt(totalIncome) - (parseInt(totalDailyVendorExpense) + parseInt(totalDailyEmployeeExpense) + parseInt(totalDailyBasicExpense));
            const totalExpense = parseInt(totalDailyVendorExpense) + parseInt(totalDailyEmployeeExpense) + parseInt(totalDailyBasicExpense);

            res.json({ totalProfit:parseInt(totalCashh[0].totalCashAmount ?? 0), totalIncome:totalGGpay, totalExpense });
          });
        })
      })
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};







exports.weeklyProfitByShop = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const user = req.userr;

    if (!shopId) {
      return res.status(404).json({ error: 'shop not found' });
    }

    // Query the Shop data
    const shopQuery = `SELECT * FROM shops WHERE userId = ? AND id = ?`;
    const totalCash =`SELECT SUM(amount) AS totalCashAmount FROM income WHERE incomeSource = 'CASH' AND shopId = ? AND userId = ? AND date BETWEEN ? AND ?`

    const totalGpay =  `
    SELECT incomeSource, SUM(amount) AS totalGpayAmount
    FROM income
    WHERE (incomeSource = 'Bank Transfer' OR incomeSource LIKE '%Google Pay%' OR incomeSource LIKE '%Paytm%' OR incomeSource LIKE '%Phone Pe%')
      AND shopId = ?
      AND userId = ?
      AND date BETWEEN ? AND ?
    GROUP BY incomeSource
  `;

    connection.query(shopQuery, [user.id, shopId], (shopError, shopData) => {
      if (shopError) {
        return res.status(500).json({
          status: 'error',
          message: 'Error fetching shop data from the database.',
        });
      }

      if (shopData.length === 0) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      const oneShop = shopData[0];
      const name = oneShop.name;
      const address = oneShop.address;
      const contactInformation = oneShop.contactInformation;

      const queryDate = req.query.date ? new Date(req.query.date) : new Date();

      // Calculate the start and end dates for the week containing the queryDate
      const startOfWeek = new Date(queryDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      console.log(dateUtils.formatDateString(startOfWeek),dateUtils.formatDateString(endOfWeek))

      const getBasicExpensesQuery = `
        SELECT *
        FROM basic_expenses
        WHERE shopId = ? AND userId = ? AND date > ? AND date < DATE_ADD(?, INTERVAL 1 DAY)
      `;
             
      // WHERE shopId = ? AND userId = ? AND date BETWEEN ? AND ?
      // const getEmployeeExpensesQuery = `
      //   SELECT *
      //   FROM employee_salary
      //   WHERE userId = ? AND date > ? AND date < DATE_ADD(?, INTERVAL 1 DAY)
      // `;
              
      // const getVendorExpensesQuery = `
      //   SELECT *
      //   FROM vendor_expense
      //   WHERE userId = ? AND date > ? AND date < DATE_ADD(?, INTERVAL 1 DAY)
      // `;
              
      const getIncomeQuery = `
        SELECT *
        FROM income
        WHERE shopId = ? AND userId = ? AND date > ? AND date < DATE_ADD(?, INTERVAL 1 DAY)
      `;
      

      connection.query(getBasicExpensesQuery, [shopId, user.id,dateUtils.formatDateString(startOfWeek), dateUtils.formatDateString(endOfWeek)], (error1, basicExpenses) => {
        if (error1) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        console.log(basicExpenses)

        // connection.query(getEmployeeExpensesQuery, [user.id, startOfWeek, endOfWeek], (error2, employeeExpenses) => {
        //   if (error2) {
        //     return res.status(500).json({
        //       status: 'error',
        //       message: 'Database error. Please try again later.',
        //     });
        //   }

        // connection.query(getVendorExpensesQuery, [user.id, startOfWeek, endOfWeek], (error3, vendorExpenses) => {
        //     if (error3) {
        //       return res.status(500).json({
        //         status: 'error',
        //         message: 'Database error. Please try again later.',
        //       });
        //     }

        connection.query(getIncomeQuery, [shopId, user.id, startOfWeek, endOfWeek], (error4, income) => {
              if (error4) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }


        connection.query(totalCash, [shopId, user.id, startOfWeek, endOfWeek], (error5, totalCashh) => {
            if (error5) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

            connection.query(totalGpay, [shopId, user.id, startOfWeek, endOfWeek], (error6, totalGpay) => {
              if (error6) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                let totalBankTransferAmount = 0;
                let totalGpayAmount = 0;

                totalGpay.forEach((row) => {
                  if (row.incomeSource === 'Bank Transfer') {
                    totalBankTransferAmount = row.totalGpayAmount;
                  } else {
                    totalGpayAmount += row.totalGpayAmount;
                  }
                });

                const totalGGpay = parseInt(totalGpayAmount)+parseInt(totalBankTransferAmount)
       

              const totalIncome = income.reduce((total, expense) => total + parseInt(expense.amount), 0);
              // const totalWeeklyVendorExpense = vendorExpenses.reduce((total, expense) => total + parseInt(expense.amount), 0);
              // const totalWeeklyEmployeeExpense = employeeExpenses.reduce((total, expense) => total + parseInt(expense.salaryAmount), 0);
              const totalWeeklyBasicExpense = basicExpenses.reduce((total, expense) => total + parseInt(expense.amount), 0);
              console.log(totalWeeklyBasicExpense)

              // const totalProfitByShop = parseInt(totalIncome) - (parseInt(totalWeeklyVendorExpense) + parseInt(totalWeeklyEmployeeExpense) + parseInt(totalWeeklyBasicExpense));
              // const totalExpenseByShop = parseInt(totalWeeklyVendorExpense) + parseInt(totalWeeklyEmployeeExpense) + parseInt(totalWeeklyBasicExpense);

              const totalProfitByShop = parseInt(totalIncome) -  parseInt(totalWeeklyBasicExpense);
              const totalExpenseByShop = parseInt(totalWeeklyBasicExpense);

              res.json({ totalProfitByShop:parseInt(totalCashh[0].totalCashAmount ?? 0), totalIncomeByShop:totalGGpay, totalExpenseByShop, name, address, contactInformation });
            });
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.weeklyProfit = async (req, res) => {
  try {
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();
    const user = req.userr;

    // Calculate the start and end dates for the week containing the queryDate
    const startOfWeek = new Date(queryDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Move to the beginning of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to the end of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999);

    const getBasicExpensesQuery = `
      SELECT *
      FROM basic_expenses
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getEmployeeExpensesQuery = `
      SELECT *
      FROM employee_salary
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getVendorExpensesQuery = `
      SELECT *
      FROM vendor_expense
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getIncomeQuery = `
      SELECT *
      FROM income
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const totalCash =`SELECT SUM(amount) AS totalCashAmount FROM income WHERE incomeSource = 'CASH' AND userId = ? AND date BETWEEN ? AND ?`

    const totalGpay =  `
    SELECT incomeSource, SUM(amount) AS totalGpayAmount
    FROM income
    WHERE (incomeSource = 'Bank Transfer' OR incomeSource LIKE '%Google Pay%' OR incomeSource LIKE '%Paytm%' OR incomeSource LIKE '%Phone Pe%')
      AND userId = ?
      AND date BETWEEN ? AND ?
    GROUP BY incomeSource
  `;

    connection.query(
      getBasicExpensesQuery,
      [user.id, startOfWeek, endOfWeek],
      (error1, basicExpenses) => {
        if (error1) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        connection.query(
          getEmployeeExpensesQuery,
          [user.id, startOfWeek, endOfWeek],
          (error2, employeeExpenses) => {
            if (error2) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

            connection.query(
              getVendorExpensesQuery,
              [user.id, startOfWeek, endOfWeek],
              (error3, vendorExpenses) => {
                if (error3) {
                  return res.status(500).json({
                    status: 'error',
                    message: 'Database error. Please try again later.',
                  });
                }

                connection.query(
                  getIncomeQuery,
                  [user.id, startOfWeek, endOfWeek],
                  (error4, income) => {
                    if (error4) {
                      return res.status(500).json({
                        status: 'error',
                        message: 'Database error. Please try again later.',
                      });
                    }

          connection.query(totalCash, [user.id, startOfWeek, endOfWeek], (error5, totalCashh) => {
            if (error5) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

            connection.query(totalGpay, [user.id, startOfWeek, endOfWeek], (error6, totalGpay) => {
              if (error6) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                let totalBankTransferAmount = 0;
                let totalGpayAmount = 0;

                totalGpay.forEach((row) => {
                  if (row.incomeSource === 'Bank Transfer') {
                    totalBankTransferAmount = row.totalGpayAmount;
                  } else {
                    totalGpayAmount += row.totalGpayAmount;
                  }
                });

                const totalGGpay = parseInt(totalGpayAmount)+parseInt(totalBankTransferAmount)

                const totalIncome = income.reduce((total, expense) => total +parseInt(expense.amount), 0);
                    const totalWeeklyVendorExpense = vendorExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
                    const totalWeeklyEmployeeExpense = employeeExpenses.reduce((total, expense) => total +parseInt(expense.salaryAmount), 0);
                    const totalWeeklyBasicExpense = basicExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);

                    const totalProfit = parseInt(totalIncome) - (parseInt(totalWeeklyVendorExpense) + parseInt(totalWeeklyEmployeeExpense) + parseInt(totalWeeklyBasicExpense));
                    const totalExpense = parseInt(totalWeeklyVendorExpense) + parseInt(totalWeeklyEmployeeExpense) + parseInt(totalWeeklyBasicExpense);
                    
                    res.json({ totalProfit:parseInt(totalCashh[0].totalCashAmount ?? 0), totalIncome:totalGGpay, totalExpense });
                  });
                });
              });
            });
          });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.monthlyProfitByShop = async (req, res) => {
  try {
    const user = req.userr;
    const shopId = req.params.shopId;
    if (!shopId) {
      return res.status(404).json({ error: 'shop not found' });
    }

    // Query the Shop data
    const shopQuery = `SELECT * FROM shops WHERE userId = ? AND id = ?`;
    const totalCash =`SELECT SUM(amount) AS totalCashAmount FROM income WHERE incomeSource = 'CASH' AND shopId = ? AND userId = ? AND date BETWEEN ? AND ?`

    const totalGpay =  `
    SELECT incomeSource, SUM(amount) AS totalGpayAmount
    FROM income
    WHERE (incomeSource = 'Bank Transfer' OR incomeSource LIKE '%Google Pay%' OR incomeSource LIKE '%Paytm%' OR incomeSource LIKE '%Phone Pe%')
      AND shopId = ?
      AND userId = ?
      AND date BETWEEN ? AND ?
    GROUP BY incomeSource
  `;

    connection.query(shopQuery, [user.id, shopId], (shopError, shopData) => {
      if (shopError) {
        return res.status(500).json({
          status: 'error',
          message: 'Error fetching shop data from the database.',
        });
      }

      if (shopData.length === 0) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      const oneShop = shopData[0];
      const name = oneShop.name;
      const address = oneShop.address;
      const contactInformation = oneShop.contactInformation;

      const queryDate = req.query.date ? new Date(req.query.date) : new Date();

      // Calculate the start and end dates for the month containing the queryDate
      const startOfMonth = new Date(queryDate);
      startOfMonth.setDate(1); // Move to the first day of the month
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the first day of the next month
      endOfMonth.setDate(0); // Move to the last day of the current month
      endOfMonth.setHours(23, 59, 59, 999);

      const getBasicExpensesQuery = `
        SELECT *
        FROM basic_expenses
        WHERE shopId = ? AND userId = ? AND date BETWEEN ? AND ?
      `;

      // const getEmployeeExpensesQuery = `
      //   SELECT *
      //   FROM employee_salary
      //   WHERE userId = ? AND date BETWEEN ? AND ?
      // `;

      // const getVendorExpensesQuery = `
      //   SELECT *
      //   FROM vendor_expense
      //   WHERE userId = ? AND date BETWEEN ? AND ?
      // `;

      const getIncomeQuery = `
        SELECT *
        FROM income
        WHERE shopId = ? AND userId = ? AND date BETWEEN ? AND ?
      `;

      connection.query(getBasicExpensesQuery, [shopId, user.id, startOfMonth, endOfMonth], (error1, basicExpenses) => {
        if (error1) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        // connection.query(getEmployeeExpensesQuery, [user.id, startOfMonth, endOfMonth], (error2, employeeExpenses) => {
        //   if (error2) {
        //     return res.status(500).json({
        //       status: 'error',
        //       message: 'Database error. Please try again later.',
        //     });
        //   }

        //   connection.query(getVendorExpensesQuery, [user.id, startOfMonth, endOfMonth], (error3, vendorExpenses) => {
        //     if (error3) {
        //       return res.status(500).json({
        //         status: 'error',
        //         message: 'Database error. Please try again later.',
        //       });
        //     }

            connection.query(getIncomeQuery, [shopId, user.id, startOfMonth, endOfMonth], (error4, income) => {
              if (error4) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                     connection.query(totalCash, [shopId, user.id, startOfMonth, endOfMonth], (error5, totalCashh) => {
            if (error5) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

            connection.query(totalGpay, [shopId, user.id, startOfMonth, endOfMonth], (error6, totalGpay) => {
              if (error6) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                let totalBankTransferAmount = 0;
                let totalGpayAmount = 0;

                totalGpay.forEach((row) => {
                  if (row.incomeSource === 'Bank Transfer') {
                    totalBankTransferAmount = row.totalGpayAmount;
                  } else {
                    totalGpayAmount += row.totalGpayAmount;
                  }
                });

                const totalGGpay = parseInt(totalGpayAmount)+parseInt(totalBankTransferAmount)
       

              const totalIncomeByShop = income.reduce((total, expense) => total +parseInt(expense.amount), 0);
              // const totalMonthlyVendorExpenseByShop = vendorExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
              // const totalMonthlyEmployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total +parseInt(expense.salaryAmount), 0);
              const totalMonthlyBasicExpenseByShop = basicExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);

              // const totalProfitByShop = parseInt(totalIncomeByShop) - (parseInt(totalMonthlyVendorExpenseByShop) + parseInt(totalMonthlyEmployeeExpenseByShop) + parseInt(totalMonthlyBasicExpenseByShop));
              // const totalExpenseByShop = parseInt(totalMonthlyVendorExpenseByShop) + parseInt(totalMonthlyEmployeeExpenseByShop) + parseInt(totalMonthlyBasicExpenseByShop);

              const totalProfitByShop = parseInt(totalIncomeByShop) - parseInt(totalMonthlyBasicExpenseByShop);
              const totalExpenseByShop =  parseInt(totalMonthlyBasicExpenseByShop);

              res.json({ totalProfitByShop:parseInt(totalCashh[0].totalCashAmount ?? 0), totalIncomeByShop:totalGGpay, totalExpenseByShop, name, address, contactInformation });
            });
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



//monthly profit
exports.monthlyProfit = async (req, res) => {
  try {
    const user = req.userr;
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    const startOfMonth = new Date(queryDate);
    startOfMonth.setDate(1); 
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); 
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const getBasicExpensesQuery = `
      SELECT *
      FROM basic_expenses
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getEmployeeExpensesQuery = `
      SELECT *
      FROM employee_salary
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getVendorExpensesQuery = `
      SELECT *
      FROM vendor_expense
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getIncomeQuery = `
      SELECT *
      FROM income
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const totalCash =`SELECT SUM(amount) AS totalCashAmount FROM income WHERE incomeSource = 'CASH' AND userId = ? AND date BETWEEN ? AND ?`

    const totalGpay =  `
    SELECT incomeSource, SUM(amount) AS totalGpayAmount
    FROM income
    WHERE (incomeSource = 'Bank Transfer' OR incomeSource LIKE '%Google Pay%' OR incomeSource LIKE '%Paytm%' OR incomeSource LIKE '%Phone Pe%')
      AND userId = ?
      AND date BETWEEN ? AND ?
    GROUP BY incomeSource
  `;

    connection.query(getBasicExpensesQuery, [user.id, startOfMonth, endOfMonth], (error1, basicExpenses) => {
      if (error1) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      connection.query(getEmployeeExpensesQuery, [user.id, startOfMonth, endOfMonth], (error2, employeeExpenses) => {
        if (error2) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        connection.query(getVendorExpensesQuery, [user.id, startOfMonth, endOfMonth], (error3, vendorExpenses) => {
          if (error3) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error. Please try again later.',
            });
          }

          connection.query(getIncomeQuery, [user.id, startOfMonth, endOfMonth], (error4, income) => {
            if (error4) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

          connection.query(totalCash, [user.id, startOfMonth, endOfMonth], (error5, totalCashh) => {
            if (error5) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

            connection.query(totalGpay, [user.id, startOfMonth, endOfMonth], (error6, totalGpay) => {
              if (error6) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                let totalBankTransferAmount = 0;
                let totalGpayAmount = 0;

                totalGpay.forEach((row) => {
                  if (row.incomeSource === 'Bank Transfer') {
                    totalBankTransferAmount = row.totalGpayAmount;
                  } else {
                    totalGpayAmount += row.totalGpayAmount;
                  }
                });

            const totalGGpay = parseInt(totalGpayAmount)+parseInt(totalBankTransferAmount)
       
            const totalIncome = income.reduce((total, expense) => total +parseInt(expense.amount), 0);
            const totalMonthlyVendorExpense = vendorExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
            const totalMonthlyEmployeeExpense = employeeExpenses.reduce((total, expense) => total +parseInt(expense.salaryAmount), 0);
            const totalMonthlyBasicExpense = basicExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);

            const totalProfit = parseInt(totalIncome) - (parseInt(totalMonthlyVendorExpense) + parseInt(totalMonthlyEmployeeExpense) + parseInt(totalMonthlyBasicExpense));
            const totalExpense = parseInt(totalMonthlyVendorExpense) + parseInt(totalMonthlyEmployeeExpense) + parseInt(totalMonthlyBasicExpense);

            res.json({ totalProfit:parseInt(totalCashh[0].totalCashAmount ?? 0), totalIncome:totalGGpay, totalExpense });
          });
        });
        });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





// Yearly profit
exports.yearlyProfitByShop = async (req, res) => {
  try {
    const user = req.userr;
    const shopId = req.params.shopId;
    if (!shopId) {
      return res.status(404).json({ error: 'shop not found' });
    }

    // Query the Shop data
    const shopQuery = `SELECT * FROM shops WHERE userId = ? AND id = ?`;
    const totalCash =`SELECT SUM(amount) AS totalCashAmount FROM income WHERE incomeSource = 'CASH' AND shopId = ? AND userId = ? AND date BETWEEN ? AND ?`

    const totalGpay =  `
    SELECT incomeSource, SUM(amount) AS totalGpayAmount
    FROM income
    WHERE (incomeSource = 'Bank Transfer' OR incomeSource LIKE '%Google Pay%' OR incomeSource LIKE '%Paytm%' OR incomeSource LIKE '%Phone Pe%')
      AND shopId = ?
      AND userId = ?
      AND date BETWEEN ? AND ?
    GROUP BY incomeSource
  `;

    connection.query(shopQuery, [user.id, shopId], (shopError, shopData) => {
      if (shopError) {
        return res.status(500).json({
          status: 'error',
          message: 'Error fetching shop data from the database.',
        });
      }

      if (shopData.length === 0) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      const oneShop = shopData[0];
      const name = oneShop.name;
      const address = oneShop.address;
      const contactInformation = oneShop.contactInformation;

      const queryDate = req.query.date ? new Date(req.query.date) : new Date();

      // Calculate the start and end dates for the year containing the queryDate
      const startOfYear = new Date(queryDate);
      startOfYear.setMonth(0, 1); // Move to the first day of January
      startOfYear.setHours(0, 0, 0, 0);

      const endOfYear = new Date(startOfYear);
      endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Move to the first day of January of the next year
      endOfYear.setHours(0, 0, 0, 0);

      const getBasicExpensesQuery = `
        SELECT *
        FROM basic_expenses
        WHERE shopId = ? AND userId = ? AND date BETWEEN ? AND ?
      `;

      // const getEmployeeExpensesQuery = `
      //   SELECT *
      //   FROM employee_salary
      //   WHERE userId = ? AND date BETWEEN ? AND ?
      // `;

      // const getVendorExpensesQuery = `
      //   SELECT *
      //   FROM vendor_expense
      //   WHERE userId = ? AND date BETWEEN ? AND ?
      // `;

      const getIncomeQuery = `
        SELECT *
        FROM income
        WHERE shopId = ? AND userId = ? AND date BETWEEN ? AND ?
      `;

      connection.query(getBasicExpensesQuery, [shopId, user.id, startOfYear, endOfYear], (error1, basicExpenses) => {
        if (error1) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        // connection.query(getEmployeeExpensesQuery, [user.id, startOfYear, endOfYear], (error2, employeeExpenses) => {
        //   if (error2) {
        //     return res.status(500).json({
        //       status: 'error',
        //       message: 'Database error. Please try again later.',
        //     });
        //   }

        //   connection.query(getVendorExpensesQuery, [user.id, startOfYear, endOfYear], (error3, vendorExpenses) => {
        //     if (error3) {
        //       return res.status(500).json({
        //         status: 'error',
        //         message: 'Database error. Please try again later.',
        //       });
        //     }

            connection.query(getIncomeQuery, [shopId, user.id, startOfYear, endOfYear], (error4, income) => {
              if (error4) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

          connection.query(totalCash, [shopId, user.id, startOfYear, endOfYear], (error5, totalCashh) => {
            if (error5) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

            connection.query(totalGpay, [shopId, user.id, startOfYear, endOfYear], (error6, totalGpay) => {
              if (error6) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                let totalBankTransferAmount = 0;
                let totalGpayAmount = 0;

                totalGpay.forEach((row) => {
                  if (row.incomeSource === 'Bank Transfer') {
                    totalBankTransferAmount = row.totalGpayAmount;
                  } else {
                    totalGpayAmount += row.totalGpayAmount;
                  }
                });

                const totalGGpay = parseInt(totalGpayAmount)+parseInt(totalBankTransferAmount)
       

              const totalIncomeByShop = income.reduce((total, expense) => total +parseInt(expense.amount), 0);
              // const totalYearlyVendorExpenseByShop = vendorExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
              // const totalYearlyEmployeeExpenseByShop = employeeExpenses.reduce((total, expense) => total +parseInt(expense.salaryAmount), 0);
              const totalYearlyBasicExpenseByShop = basicExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);

              // const totalProfitByShop = parseInt(totalIncomeByShop) - (parseInt(totalYearlyVendorExpenseByShop) + parseInt(totalYearlyEmployeeExpenseByShop) + parseInt(totalYearlyBasicExpenseByShop));
              // const totalExpenseByShop = parseInt(totalYearlyVendorExpenseByShop) + parseInt(totalYearlyEmployeeExpenseByShop) + parseInt(totalYearlyBasicExpenseByShop);

              const totalProfitByShop = parseInt(totalIncomeByShop) -  parseInt(totalYearlyBasicExpenseByShop);
              const totalExpenseByShop=parseInt(totalYearlyBasicExpenseByShop);

              res.json({ totalProfitByShop:parseInt(totalCashh[0].totalCashAmount ?? 0), totalIncomeByShop:totalGGpay, totalExpenseByShop, name, address, contactInformation });
            });
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.yearlyProfit = async (req, res) => {
  try {
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();
    const user = req.userr;

    const startOfYear = new Date(queryDate);
    startOfYear.setMonth(0, 1); // Move to the first day of January
    startOfYear.setHours(0, 0, 0, 0);

    const endOfYear = new Date(startOfYear);
    endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Move to the first day of January of the next year
    endOfYear.setHours(0, 0, 0, 0);

    const getBasicExpensesQuery = `
      SELECT *
      FROM basic_expenses
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getEmployeeExpensesQuery = `
      SELECT *
      FROM employee_salary
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getVendorExpensesQuery = `
      SELECT *
      FROM vendor_expense
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const getIncomeQuery = `
      SELECT *
      FROM income
      WHERE userId = ? AND date BETWEEN ? AND ?
    `;

    const totalCash =`SELECT SUM(amount) AS totalCashAmount FROM income WHERE incomeSource = 'CASH' AND userId = ? AND date BETWEEN ? AND ?`

    const totalGpay =  `
    SELECT incomeSource, SUM(amount) AS totalGpayAmount
    FROM income
    WHERE (incomeSource = 'Bank Transfer' OR incomeSource LIKE '%Google Pay%' OR incomeSource LIKE '%Paytm%' OR incomeSource LIKE '%Phone Pe%')
      AND userId = ?
      AND date BETWEEN ? AND ?
    GROUP BY incomeSource
  `;

    connection.query(getBasicExpensesQuery, [user.id, startOfYear, endOfYear], (error1, basicExpenses) => {
      if (error1) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      connection.query(getEmployeeExpensesQuery, [user.id, startOfYear, endOfYear], (error2, employeeExpenses) => {
        if (error2) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        connection.query(getVendorExpensesQuery, [user.id, startOfYear, endOfYear], (error3, vendorExpenses) => {
          if (error3) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error. Please try again later.',
            });
          }

          connection.query(getIncomeQuery, [user.id, startOfYear, endOfYear], (error4, income) => {
            if (error4) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }
          
          connection.query(totalCash, [user.id, startOfYear, endOfYear], (error5, totalCashh) => {
            if (error5) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error. Please try again later.',
              });
            }

          connection.query(totalGpay, [user.id, startOfYear, endOfYear], (error6, totalGpay) => {
              if (error6) {
                return res.status(500).json({
                  status: 'error',
                  message: 'Database error. Please try again later.',
                });
              }

                let totalBankTransferAmount = 0;
                let totalGpayAmount = 0;

                totalGpay.forEach((row) => {
                  if (row.incomeSource === 'Bank Transfer') {
                    totalBankTransferAmount = row.totalGpayAmount;
                  } else {
                    totalGpayAmount += row.totalGpayAmount;
                  }
                });

            const totalGGpay = parseInt(totalGpayAmount)+parseInt(totalBankTransferAmount)
       

            const totalIncome = income.reduce((total, expense) => total +parseInt(expense.amount), 0);
            const totalYearlyVendorExpense = vendorExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);
            const totalYearlyEmployeeExpense = employeeExpenses.reduce((total, expense) => total +parseInt(expense.salaryAmount), 0);
            const totalYearlyBasicExpense = basicExpenses.reduce((total, expense) => total +parseInt(expense.amount), 0);

            const totalProfit = parseInt(totalIncome) - (parseInt(totalYearlyVendorExpense) + parseInt(totalYearlyEmployeeExpense) + parseInt(totalYearlyBasicExpense));
            const totalExpense = parseInt(totalYearlyVendorExpense) + parseInt(totalYearlyEmployeeExpense) + parseInt(totalYearlyBasicExpense);

            res.json({ totalProfit:parseInt(totalCashh[0].totalCashAmount ?? 0), totalIncome:totalGGpay, totalExpense });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// excel code

    // const data = [
    //   // employee
    //     {
    //     sheet: "All Employee",
    //     columns: [
    //       { label: "EMPLOYEE NAME", value: "name" },
    //       { label: "SALARY", value: "salary" },
    //       { label: "ADDRESS", value: "address" },
    //       { label: "BALANCE", value: "balanced" },
    //       { label: "PHONE NUMBER", value: "phoneNumber" },
    //       { label:"JOIN DATE", value:"joinDate"},
    //     ],
    //     content: responseData.registerEmployee.map(employee => {
    //         return {
    //           name: employee.name,
    //           salary: employee.salary,
    //           address: employee.address,
    //           balanced: employee.balanced,
    //           phoneNumber: employee.phoneNumber,
    //           joinDate: employee.joinDate,
    //         };
    //       }),
    //     },
    //   {
    //     sheet: "Employee Expenses",
    //     columns: [
    //         { label: "EMPLOYEE NAME", value: "name" },
    //         { label: "SALARY AMOUNT", value: "salaryAmount" },
    //         { label: "DATE", value: "date" },
    //         { label: "DESCRIPTION", value: "description" },
    //         { label: "PAYMENT METHOD", value: "paymentMethod" },
    //     ],
        
    //     content: responseData.registerEmployee.reduce((expenses, employee) => {
    //       return expenses.concat(employee.expenses.map(expense => {
    //         return {
    //           name: employee.name,
    //           salaryAmount:parseInt(expense.salaryAmount),
    //           date: expense.date,
    //           description: expense.description,
    //           paymentMethod: expense.paymentMethod,
              
    //         };
    //       }));
    //     }, []),
    //   },

    //   // vendor
    //   {
    //     sheet: "All Vendors",
    //     columns: [
    //       { label: "VENDOR NAME", value: "vendorName" },
    //       { label: "ADDRESS", value: "address" },
    //       { label: "CONTACT INFORMATION", value: "contactInformation" },
    //     ],
    //     content: responseData.registerVendor,
    //   },
    //   {
    //     sheet: "Vendor Expenses",
    //     columns: [
    //         { label: "VENDOR NAME", value: "vendorName" },
    //         { label: "PRODUCT NAME", value: "productName" },
    //         { label: "DESCRIPTION", value: "description" },
    //         { label: "QUANTITY", value: "quantity" },
    //         { label: "BILL NUMBER", value: "billNumber" },
    //         { label: "DATE", value: "date" },
    //         { label: "AMOUNT", value: "amount" },
    //         { label: "PAYMENT DUE DATE", value: "paymentDueDate" },
    //         { label: "PAYMENT STATUS", value: "paymentStatus" },
    //     ],
    //     content: responseData.registerVendor.reduce((expenses, vendor) => {
    //       return expenses.concat(vendor.expenses.map(expense => {
    //         return {
    //           vendorName: vendor.vendorName,
    //           productName: expense.productName,
    //           description: expense.description,
    //           quantity: expense.quantity,
    //           billNumber: expense.billNumber,
    //           date: expense.date,
    //           amount:parseInt(expense.amount),
    //           paymentDueDate: new Date(expense.paymentDueDate).toISOString().split('T')[0],
    //           paymentStatus: expense.paymentStatus,
    //           };
    //         }));
    //       }, []),
    //     },

    //   {
    //     sheet: "Basic Expenses",
    //     columns: [
    //         { label: "EXPENSE NAME", value: "expenseName" },
    //         { label: "AMOUNT", value: "amount" },
    //         { label: "DATE", value: "date" },
    //         { label: "DESCRIPTION", value: "description" },
    //     ],
    //     content: responseData.basicExpenses,
    //   },
    //   {
    //     sheet: "Income Data",
    //     columns: [
    //         { label: "AMOUNT", value: "amount" },
    //         { label: "DATE", value: "date" },
    //         { label: "BILL NUMBER", value: "billNumber" },
    //         { label: "DESCRIPTION", value: "description" },
    //         { label: "INCOME SOURCE", value: "incomeSource" },
    //         { label: "PRODUCT SOLD QUANTITY", value: "ProductSoldQuantity" },
    //     ],
    //     content: responseData.incomeData,
    //   },
    //   {
    //     sheet: "Shop Overview",
    //     columns: [
    //       { label: "SHOP NAME", value: "shopName" },
    //       { label: "TOTAL INCOME BY SHOP", value: "totalIncomeByShop" },
    //       { label: "TOTAL PROFIT BY SHOP", value: "totalProfitByShop" },
    //       { label: "TOTAL EXPENSE BY SHOP", value: "totalExpenseByShop" },
    //     ],
    //     content: [responseData], // Shop-level data
    //   },
    // ];


    // // Additional settings
    // const settings = {
    //   writeOptions:{
    //     type: "buffer",
    //     bookType: "xlsx",
    //   },
    // };


    // console.log('Data Array:', data);

    // const buffer = xlsx(data, settings);


    // // Set the appropriate headers for file download
    // res.setHeader('Content-Type', 'application/octet-stream');
    // res.setHeader('Content-Disposition', `attachment; filename="${responseData.shopName}_expenses_report_(${startt} to ${endd}).xlsx"`);

    // res.end(buffer);
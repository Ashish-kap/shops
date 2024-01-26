

const createDbConnection = require('./db'); 
const connection = createDbConnection();

// exports.createEmployeeSalaries =async (req, res) => {
//   try {
//     const user = req.userr
//     const employeeId=req.params.employeeId

//     // Get the employee's current balance from the database
    // const employee = await Employee.findById(employeeId);
    // if (!employee) {
    //   return res.status(404).json({ error: 'Employee not found' });
    // }

//     // Create the employee salary record
//     const employeeSalary = new EmployeeSalary({
//       salaryAmount:req.body.salaryAmount,
//       date: req.body.date,
//       description: req.body.description,
//       paymentMethod: req.body.paymentMethod,
//       whichMonthSalary:req.body.whichMonthSalary,
//       employeeId,
//       userId:user._id,
//     });

//     const newBalance = employee.balanced - employeeSalary.salaryAmount;
//     employee.balanced = newBalance;

//     await employee.save();
//     // Save the employee salary record to the database
//     await employeeSalary.save();

//     res.status(201).json({
//       status:"success",
//       employeeSalary
//     });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ 
//       message:error.message,
//       error: 'Internal server error' });
//   }
// };

exports.createEmployeeSalaries = async (req, res) => {
  try {
    const user = req.userr;
    const employeeId = req.params.employeeId;

    // Get the employee's current balance from the database
    const findEmployeeQuery = 'SELECT balanced FROM employee WHERE id = ?';
    connection.query(findEmployeeQuery, [employeeId], async (error, results) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Employee not found' });
      }

      const currentBalance = results[0].balanced;

      // Calculate the new balance
      const salaryAmount = req.body.salaryAmount;
      const newBalance = currentBalance - salaryAmount;

      // Create the employee salary record
      const createEmployeeSalaryQuery = `
        INSERT INTO employee_salary (salaryAmount, date, whichMonthSalary, description, paymentMethod, userId, employeeId)
        VALUES (?, NOW(), ?, ?, ?, ?, ?)
      `;

      const createEmployeeSalaryValues = [
        salaryAmount,
        req.body.whichMonthSalary,
        req.body.description,
        req.body.paymentMethod,
        user.id,
        employeeId,
      ];

      connection.query(createEmployeeSalaryQuery, createEmployeeSalaryValues, (salaryError, salaryResults) => {
        if (salaryError) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        // Update the employee's balance in the database
        const updateBalanceQuery = 'UPDATE employee SET balanced = ? WHERE id = ?';
        connection.query(updateBalanceQuery, [newBalance, employeeId], (balanceError) => {
          if (balanceError) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error. Please try again later.',
            });
          }

          res.status(201).json({
            status: 'success',
            employeeSalary: {
              id: salaryResults.insertId,
              salaryAmount,
              date: new Date(),
              whichMonthSalary: req.body.whichMonthSalary,
              description: req.body.description,
              paymentMethod: req.body.paymentMethod,
              userId: user.id,
              employeeId,
            },
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      error: 'Internal server error',
    });
  }
};


// exports.updateEmployeeExpense =  async (req, res) => {
//   try {
//     const salaryId = req.params.salaryId;
//     const updates = req.body;
//     const user = req.userr

//     // Find the employee salary using the salaryId
//     const employeeSalary = await EmployeeSalary.findById(salaryId);

//     // Check if the employee salary exists
//     if (!employeeSalary) {
//       return res.status(404).json({ error: 'Employee salary not found' });
//     }

//     // Update the employee salary with the provided updates
//     Object.assign(employeeSalary, updates);

//     // Save the updated employee salary
//     const updatedEmployeeSalary = await employeeSalary.save();

//     res.status(200).json({
//       status:"success",
//       updatedEmployeeSalary
//     });
//   } catch (err) {

//     res.status(400).json({ 
//       message:err.messagem,
//       error: err.message
//      });
//   }
// };


exports.updateEmployeeExpense = async (req, res) => {
  try {
    const salaryId = req.params.salaryId;
    const updates = req.body;
    const user = req.userr;
    const employeeId = req.params.employeeId;

    // Find the employee salary using the salaryId
    const findEmployeeSalaryQuery = 'SELECT * FROM employee_salary WHERE id = ?';
    connection.query(findEmployeeSalaryQuery, [salaryId], async (error, results) => {
      if (error) {
        console.error('MySQL error:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Database error. Please try again later.',
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Employee salary not found' });
      }

      const currentSalary = parseFloat(results[0].salaryAmount); // Parse salary as a float

      // Find the employee using the employeeId
      const findEmployeeQuery = 'SELECT balanced FROM employee WHERE id = ?';
      connection.query(findEmployeeQuery, [employeeId], async (employeeError, employeeResults) => {
        if (employeeError) {
          console.error('employeeError error:', employeeError);
          return res.status(500).json({
            status: 'error',
            message: 'Database employee error. Please try again later.',
          });
        }

        if (employeeResults.length === 0) {
          return res.status(404).json({ status: 'failed', message: 'Employee not found' });
        }

        const currentBalance = parseFloat(employeeResults[0].balanced); // Parse balance as a float
        const newBalance = currentBalance + currentSalary - parseFloat(updates.salaryAmount); // Parse updates.salaryAmount

        // Update the employee's balance in the database
        const updateBalanceQuery = 'UPDATE employee SET balanced = ? WHERE id = ?';
        connection.query(updateBalanceQuery, [newBalance, employeeId], (balanceError) => {
          if (balanceError) {
            console.error('balance error:', balanceError);
            return res.status(500).json({
              status: 'error',
              message: 'Database balance error. Please try again later.',
            });
          }

          // Update the employee salary with the provided updates
          const updateEmployeeSalaryQuery = `
            UPDATE employee_salary
            SET salaryAmount = ?, whichMonthSalary = ?, description = ?,date= ?,  paymentMethod = ?
            WHERE id = ?;
          `;

          const updateEmployeeSalaryValues = [
            updates.salaryAmount,
            updates.whichMonthSalary,
            updates.description,
            updates.date,
            updates.paymentMethod,
            salaryId,
          ];

          connection.query(updateEmployeeSalaryQuery, updateEmployeeSalaryValues, (salaryError) => {
            if (salaryError) {
              console.error('salary error:', salaryError);
              return res.status(500).json({
                status: 'error',
                message: 'Database update employee error. Please try again later.',
              });
            }

            res.status(200).json({
              status: 'success',
              updatedEmployeeSalary: {
                id: salaryId,
                salaryAmount: updates.salaryAmount,
                whichMonthSalary: updates.whichMonthSalary,
                description: updates.description,
                paymentMethod: updates.paymentMethod,
                userId: user._id,
                employeeId,
              },
            });
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      error: 'Internal server error',
    });
  }
};



// exports.deleteEmployeeExpense = async (req, res) => {
//   try {
//     const salaryId = req.params.salaryId;
//     const employeeId = req.params.employeeId
//     const user = req.userr

//     // Find the employee salary using the salaryId
//     const employeeSalary = await EmployeeSalary.findById(salaryId);

//     // Check if the employee salary exists
//     if (!employeeSalary) {
//       return res.status(404).json({ error: 'Employee salary not found' });
//     }

//     const employee = await Employee.findById(employeeId);

//     const newBalance = employee.balanced + employeeSalary.salaryAmount;
//     employee.balanced = newBalance;

//     // Delete the employee salary from the database
//     await EmployeeSalary.deleteOne({ _id: salaryId });

//     await employee.save();

//     await Shop.updateMany({}, { $pull: { EmployeeSalary: salaryId } });
//     res.status(200).json({ 
//       status:"success",
//       message: 'Employee salary deleted successfully'
//      });
//   } catch (err) {
//     res.status(500).json({ 
//       message:err.message,
//       error: 'An error occurred while deleting the employee salary' });
//   }
// };

exports.deleteEmployeeExpense = async (req, res) => {
  try {
    const salaryId = req.params.salaryId;
    const employeeId = req.params.employeeId;
    const user = req.userr;

    // Find the employee salary using the salaryId
    const findEmployeeSalaryQuery = 'SELECT salaryAmount FROM employee_salary WHERE id = ?';
    connection.query(findEmployeeSalaryQuery, [salaryId], async (error, salaryResults) => {
      if (error) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error while finding employee salary. Please try again later.',
        });
      }

      if (salaryResults.length === 0) {
        return res.status(404).json({ status: 'failed', message: 'Employee salary not found' });
      }

      const salaryAmount = parseFloat(salaryResults[0].salaryAmount);

      // Find the employee using the employeeId
      const findEmployeeQuery = 'SELECT balanced FROM employee WHERE id = ?';
      connection.query(findEmployeeQuery, [employeeId], async (error, employeeResults) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error while finding employee. Please try again later.',
          });
        }

        if (employeeResults.length === 0) {
          return res.status(404).json({ status: 'failed', message: 'Employee not found' });
        }

        const currentBalance = parseFloat(employeeResults[0].balanced);

        // Calculate the new balance
        const newBalance = currentBalance + salaryAmount;

        // Update the employee's balance in the database
        const updateBalanceQuery = 'UPDATE employee SET balanced = ? WHERE id = ?';
        connection.query(updateBalanceQuery, [newBalance, employeeId], (balanceError) => {
          if (balanceError) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error while updating employee balance. Please try again later.',
            });
          }

          // Delete the employee salary from the database
          const deleteEmployeeSalaryQuery = 'DELETE FROM employee_salary WHERE id = ?';
          connection.query(deleteEmployeeSalaryQuery, [salaryId], (deleteError) => {
            if (deleteError) {
              return res.status(500).json({
                status: 'error',
                message: 'Database error while deleting employee salary. Please try again later.',
              });
            }

              res.status(200).json({
                status: 'success',
                message: 'Employee salary deleted successfully',
              });
  
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
      error: 'An error occurred while deleting the employee salary',
    });
  }
};


// exports.dailyEmployeeExpense= async (req, res) => {
//   try {
//     const user = req.userr

//     const queryDate = req.query.date ? new Date(req.query.date) : new Date();

//     // Set the start and end time for the queryDate (midnight to midnight)
//     const startTime = new Date(queryDate);
//     startTime.setHours(0, 0, 0, 0);
//     const endTime = new Date(queryDate);
//     endTime.setHours(23, 59, 59, 999);

//     const expenses = await EmployeeSalary.find({

//       userId:user._id,
//       date: { $gte: startTime, $lte: endTime },
//     });

//     const totalExpense = expenses.reduce((total, expense) => total + expense.salaryAmount, 0);
//     res.json({ totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.weeklyEmployeeExpense =  async (req, res) => {
//   try {
//     // const shopId = req.params.shopId;
//     const user = req.userr

//     const queryDate = req.query.date ? new Date(req.query.date) : new Date();

//     // Calculate the start and end dates for the week containing the queryDate
//     const startOfWeek = new Date(queryDate);
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Move to the beginning of the week (Sunday)
//     startOfWeek.setHours(0, 0, 0, 0);

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to the end of the week (Saturday)
//     endOfWeek.setHours(23, 59, 59, 999);

//     // Fetch all expenses for the specific shop and within the specified week
//     const expenses = await EmployeeSalary.find({
//       userId:user._id,
//       date: { $gte: startOfWeek, $lte: endOfWeek },
//     });

//     const totalExpense = expenses.reduce((total, expense) => total + expense.salaryAmount, 0);
//     res.json({ totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.monthlyEmployeeExpense = async (req, res) => {
//   try {

//     const user = req.userr

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
//     const expenses = await EmployeeSalary.find({
//       userId:user._id,
//       date: { $gte: startOfMonth, $lte: endOfMonth },
//     });

//     const totalExpense = expenses.reduce((total, expense) => total + expense.salaryAmount, 0);
//     res.json({ totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.yearlyEmployeeExpense = async (req, res) => {
//   try {

//     const user = req.userr

//     const queryDate = req.query.date ? new Date(req.query.date) : new Date();

//     // Calculate the start and end dates for the year containing the queryDate
//     const startOfYear = new Date(queryDate);
//     startOfYear.setMonth(0, 1); // Move to the first day of January
//     startOfYear.setHours(0, 0, 0, 0);

//     const endOfYear = new Date(startOfYear);
//     endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Move to the first day of January of the next year
//     endOfYear.setHours(0, 0, 0, 0);

//     // Fetch all expenses for the specific shop and within the specified year
//     const expenses = await EmployeeSalary.find({
//       userId:user._id,
//       date: { $gte: startOfYear, $lt: endOfYear },
//     });

//     const totalExpense = expenses.reduce((total, expense) => total + expense.salaryAmount, 0);
//     res.json({ totalExpense });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


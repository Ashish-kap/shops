const schedule = require('node-schedule');

const createDbConnection = require('./db'); 
const connection = createDbConnection();


// exports.registerEmployee = async (req, res) => {
//   try {
 
//     const user = req.userr
//     const { name, salary, address, phoneNumber } = req.body;
//     // Create a new employee record
//     const newEmployee = new registerEmployee({
//       name,
//       salary,
//       address,
//       phoneNumber,
//       userId:user._id,
//     });
//     // Save the new employee record to the database
//     const newBalance = newEmployee.salary
//     newEmployee.balanced= newBalance
//     const savedEmployee = await newEmployee.save();

//     res.status(201).json({
//       status:"success",
//       savedEmployee
//     });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ 
//       message:error.message,
//       error: 'Internal server error'
//      });
//   }
// };


exports.registerEmployee = async (req, res) => {
  try {
    const user = req.userr;
    const { name, salary, address,shopName, phoneNumber,joinDate } = req.body;

    // Create a new employee record
    const newEmployeeQuery = `
      INSERT INTO employee (name, salary, address, balanced, phoneNumber,shopName,joinDate, userId)
      VALUES (?, ?, ?, ?, ?,?,?,?)
    `;

    const newEmployeeValues = [name, salary, address, salary, phoneNumber,shopName,joinDate, user.id];

    connection.query(newEmployeeQuery, newEmployeeValues, (error, results) => {
      if (error) {
        console.error('Error creating employee:', error);
        return res.status(500).json({ 
          error: 'Internal server error',
          message: error.message,
        });
      }

      // Calculate the balance based on the initial salary
      const newEmployeeId = results.insertId;
      const updateBalanceQuery = 'UPDATE employee SET balanced = salary WHERE id = ?';
      connection.query(updateBalanceQuery, [newEmployeeId], (balanceError) => {
        if (balanceError) {
          console.error('Error updating employee balance:', balanceError);
        }
      });

      res.status(201).json({
        status: 'success',
        savedEmployee: {
          id:newEmployeeId,
          name,
          salary,
          address,
          balanced:salary,
          phoneNumber,
          shopName,
          joinDate,
          userId: user.id,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      message: error.message,
      error: 'Internal server error',
    });
  }
};


exports.updateEmployee =async(req, res) => {
  const employeeId = req.params.employeeId;
  const updatedEmployeeData = req.body; 

  connection.query('UPDATE employee SET ? WHERE id = ?', [updatedEmployeeData, employeeId], (err, result) => {
    if (err) {
      console.error('Error updating employee data: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({status: "success", message: 'Employee data updated successfully' });
    }
  });
};

exports.getOneEmployee =async(req, res) => {
  const employeeId = req.params.employeeId;

  connection.query('select * from employee WHERE id = ?', [employeeId], (err, result) => {
    if (err) {
      console.error('Error for employee data: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({result});
    }
  });
};


// exports.getRegisterEmployee = async (req, res) => {
//   try {
   
//     const user = req.userr;
//     const employees = await registerEmployee.find({userId:user._id.toString()});
//     res.json(employees);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.getRegisterEmployee = async (req, res) => {
  try {
    const user = req.userr;

    const getEmployeesQuery = 'SELECT * FROM employee WHERE userId = ?';
    connection.query(getEmployeesQuery, [user.id], (error, results) => {
      if (error) {
        return res.status(500).json({
          error: 'Failed to fetch employees',
          message: error.message,
        });
      }

      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



// schedule.scheduleJob('0 0 1 * *', async () => {
//   try {
//     // Get all employees
//     const employees = await registerEmployee.find();

//     for (const employee of employees) {
//       const newBalanced = employee.balanced + employee.salary;
//       await registerEmployee.findByIdAndUpdate(employee._id, { $set: { balanced: newBalanced } });
//     }

//     console.log('Balances updated successfully.');
//   } catch (error) {
//     console.error('Error updating balances:', error);
//   }
// });

schedule.scheduleJob('0 0 1 * *', async () => {
  try {
    // Fetch all employees from the database
    const [rows] = await pool.query('SELECT * FROM employee');

    for (const employee of rows) {
      const newBalance = employee.balanced + employee.salary;
      // Update the employee's balance in the database
      await pool.query('UPDATE employee SET balance = ? WHERE id = ?', [newBalance, employee.id]);
    }

    console.log('Balances updated successfully.');
  } catch (error) {
    console.error('Error updating balances:', error);
  }
});


// exports.deleteEmployee =  async (req, res) => {
//   const employeeId = req.params.employeeId;
//   try {
//     // Attempt to find the employee by its ID and delete it
//     const deletedemployee = await registerEmployee.findByIdAndDelete(employeeId);

//     if (!deletedemployee) {
//       return res.status(404).json({ 
//         message: 'Employee not found'
//        });
//     }

//     await EmployeeSalary.deleteMany({employeeId});

//     return res.status(200).json({status:"success",message: 'employee deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting employee:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

exports.deleteEmployee = async (req, res) => {
  const employeeId = req.params.employeeId;
  try {
    // Find the employee using the employeeId
    const findEmployeeQuery = 'SELECT userId FROM employee WHERE id = ?';
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

      const employee = results[0];
      const userId = employee.userId;

      // Check if the user has permission to delete the employee
      if (userId !== req.userr.id) {
        return res.status(403).json({
          status: 'failed',
          message: 'You do not have permission to delete this employee',
        });
      }

      // Delete the employee and related records
      const deleteEmployeeQuery = 'DELETE FROM employee WHERE id = ?';
      connection.query(deleteEmployeeQuery, [employeeId], async (error) => {
        if (error) {
          return res.status(500).json({
            status: 'error',
            message: 'Database error. Please try again later.',
          });
        }

        const deleteSalaryQuery = 'DELETE FROM employee_salary WHERE employeeId = ?';
        connection.query(deleteSalaryQuery, [employeeId], async (error) => {
          if (error) {
            return res.status(500).json({
              status: 'error',
              message: 'Database error. Please try again later.',
            });
          }

          res.status(200).json({
            status: 'success',
            message: 'Employee deleted successfully',
          });
        });
      });
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

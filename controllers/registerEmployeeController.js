const registerEmployee = require('../model/registerEmployee.js');
const EmployeeSalary = require('../model/employee.js');
const schedule = require('node-schedule');
const Shop = require('../model/shop.js'); 

exports.registerEmployee = async (req, res) => {
  try {
    const shopId = req.params.shopId
    const user = req.userr
    const { name, salary, address, phoneNumber } = req.body;
    // Create a new employee record
    const newEmployee = new registerEmployee({
      name,
      salary,
      address,
      phoneNumber,
      shopId,
      userId:user._id,
    });
    // Save the new employee record to the database
    const newBalance = newEmployee.salary
    newEmployee.balanced= newBalance
    const savedEmployee = await newEmployee.save();

    res.status(201).json({
      status:"success",
      savedEmployee
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ 
      message:error.message,
      error: 'Internal server error'
     });
  }
};


exports.getRegisterEmployee = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const user = req.userr;
    console.log(user._id.toString(),shopId)
    const employees = await registerEmployee.find({shopId:shopId,userId:user._id.toString()});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


schedule.scheduleJob('0 0 1 * *', async () => {
  try {
    // Get all employees
    const employees = await registerEmployee.find();

    // Update each employee's balanced field by adding their salary
    for (const employee of employees) {
      const newBalanced = employee.balanced + employee.salary;
      await registerEmployee.findByIdAndUpdate(employee._id, { $set: { balanced: newBalanced } });
    }

    console.log('Balances updated successfully.');
  } catch (error) {
    console.error('Error updating balances:', error);
  }
});


exports.deleteEmployee =  async (req, res) => {
  const employeeId = req.params.employeeId;
  try {
    // Attempt to find the employee by its ID and delete it
    const deletedemployee = await registerEmployee.findByIdAndDelete(employeeId);

    if (!deletedemployee) {
      return res.status(404).json({ 
        message: 'Employee not found'
       });
    }

    await EmployeeSalary.deleteMany({employeeId});

    return res.status(200).json({status:"success",message: 'employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



const express = require('express');
const employeeController = require('../controllers/employeeController.js');
const registerEmployeeController = require('../controllers/registerEmployeeController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.post('/create-employee-salaries/:shopId/employee/:employeeId',employeeController.createEmployeeSalaries)
router.patch('/update-employee-salaries/:salaryId',employeeController.updateEmployeeExpense)
router.delete('/delete-employee-salaries/:salaryId/employee/:employeeId',employeeController.deleteEmployeeExpense)

router.get('/daily-employee-expenses/:shopId',employeeController.dailyEmployeeExpense)
router.get('/employee-expenses/weeklyEmployeeExpense/:shopId',employeeController.weeklyEmployeeExpense)
router.get('/employee-expenses/monthlyEmployeeExpense/:shopId',employeeController.monthlyEmployeeExpense)
router.get('/employee-expenses/yearlyEmployeeExpense/:shopId',employeeController.yearlyEmployeeExpense)



// Register EMployeee
router.post('/register-employee/:shopId',registerEmployeeController.registerEmployee)
router.get('/get-register-employee/:shopId',registerEmployeeController.getRegisterEmployee)

module.exports =router;




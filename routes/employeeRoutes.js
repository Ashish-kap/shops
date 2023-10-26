const express = require('express');
const employeeController = require('../controllers/employeeController.js');
const registerEmployeeController = require('../controllers/registerEmployeeController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.post('/create-employee-salaries/employee/:employeeId',authController.protect,employeeController.createEmployeeSalaries)
router.patch('/update-employee-salaries/:salaryId',authController.protect,employeeController.updateEmployeeExpense)
router.delete('/delete-employee-salaries/:salaryId/employee/:employeeId',authController.protect,employeeController.deleteEmployeeExpense)

router.get('/daily-employee-expenses',authController.protect,employeeController.dailyEmployeeExpense)
router.get('/employee-expenses/weeklyEmployeeExpense',authController.protect,employeeController.weeklyEmployeeExpense)
router.get('/employee-expenses/monthlyEmployeeExpense',authController.protect,employeeController.monthlyEmployeeExpense)
router.get('/employee-expenses/yearlyEmployeeExpense',authController.protect,employeeController.yearlyEmployeeExpense)



// Register EMployeee
router.post('/register-employee',authController.protect,registerEmployeeController.registerEmployee)
router.delete('/delete-employee/:employeeId',authController.protect,registerEmployeeController.deleteEmployee)
router.get('/get-register-employee',authController.protect,registerEmployeeController.getRegisterEmployee)

module.exports =router;




const express = require('express');
const employeeController = require('../controllers/employeeController.js');
const registerEmployeeController = require('../controllers/registerEmployeeController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.post('/create-employee-salaries/:shopId/employee/:employeeId',authController.protect,employeeController.createEmployeeSalaries)
router.patch('/update-employee-salaries/:salaryId',authController.protect,employeeController.updateEmployeeExpense)
router.delete('/delete-employee-salaries/:salaryId/employee/:employeeId',authController.protect,employeeController.deleteEmployeeExpense)

router.get('/daily-employee-expenses/:shopId',authController.protect,employeeController.dailyEmployeeExpense)
router.get('/employee-expenses/weeklyEmployeeExpense/:shopId',authController.protect,employeeController.weeklyEmployeeExpense)
router.get('/employee-expenses/monthlyEmployeeExpense/:shopId',authController.protect,employeeController.monthlyEmployeeExpense)
router.get('/employee-expenses/yearlyEmployeeExpense/:shopId',authController.protect,employeeController.yearlyEmployeeExpense)



// Register EMployeee
router.post('/register-employee/:shopId',authController.protect,registerEmployeeController.registerEmployee)
router.delete('/delete-employee/:employeeId',authController.protect,registerEmployeeController.deleteEmployee)
router.get('/get-register-employee/:shopId',authController.protect,registerEmployeeController.getRegisterEmployee)

module.exports =router;




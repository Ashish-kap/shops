const express = require('express');
const employeeController = require('../controllers/employeeController.js');
const registerEmployeeController = require('../controllers/registerEmployeeController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.post('/create-employee-salaries/employee/:employeeId',authController.protect,employeeController.createEmployeeSalaries)
router.patch('/update-employee-salaries/:salaryId/:employeeId',authController.protect,employeeController.updateEmployeeExpense)
router.delete('/delete-employee-salaries/:salaryId/employee/:employeeId',authController.protect,employeeController.deleteEmployeeExpense)

// Register EMployeee
router.post('/register-employee',authController.protect,registerEmployeeController.registerEmployee)
router.put('/update-employee/:employeeId',authController.protect,registerEmployeeController.updateEmployee)


router.delete('/delete-employee/:employeeId',authController.protect,registerEmployeeController.deleteEmployee)
router.get('/get-register-employee',authController.protect,registerEmployeeController.getRegisterEmployee)
router.get('/get-one-employee/:employeeId',authController.protect,registerEmployeeController.getOneEmployee)


module.exports =router;




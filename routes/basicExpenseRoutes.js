const express = require('express');
const basicExpenseController = require('../controllers/basicExpenseController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.post('/create-basic-expenses/:shopId', basicExpenseController.createBasicExpense)
router.patch('/update-basic-expenses/:expenseId', basicExpenseController.updateBasixExpense)
router.delete('/delete-basic-expenses/:expenseId', basicExpenseController.deleteBasicExpense)

router.get('/daily-basic-expenses/:shopId',basicExpenseController.dailyBasicExpense)
router.get('/basic-expenses/weeklyBasicExpense/:shopId',basicExpenseController.weeklyBasicExpense)
router.get('/basic-expenses/monthlyBasicExpense/:shopId',basicExpenseController.monthlyBasicExpense)
router.get('/basic-expenses/yearlyBasicExpense/:shopId',basicExpenseController.yearlyBasicExpense)


module.exports=router;







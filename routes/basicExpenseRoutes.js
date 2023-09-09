const express = require('express');
const basicExpenseController = require('../controllers/basicExpenseController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.post('/create-basic-expenses/:shopId',authController.protect,basicExpenseController.createBasicExpense)
router.patch('/update-basic-expenses/:expenseId', authController.protect, basicExpenseController.updateBasixExpense)
router.delete('/delete-basic-expenses/:expenseId',authController.protect, basicExpenseController.deleteBasicExpense)

router.get('/daily-basic-expenses/:shopId',authController.protect, basicExpenseController.dailyBasicExpense)
router.get('/basic-expenses/weeklyBasicExpense/:shopId',authController.protect, basicExpenseController.weeklyBasicExpense)
router.get('/basic-expenses/monthlyBasicExpense/:shopId',authController.protect,basicExpenseController.monthlyBasicExpense)
router.get('/basic-expenses/yearlyBasicExpense/:shopId',authController.protect,basicExpenseController.yearlyBasicExpense)


router.get('/get-expense-type',authController.protect,basicExpenseController.getAllExpenseTypes)
router.post('/push-expense-type',authController.protect,basicExpenseController.addExpenseType)
router.delete('/delete-expense-type/:expenseTypeId',authController.protect,basicExpenseController.deleteExpenseType)



module.exports=router;







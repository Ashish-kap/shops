const express = require('express');
const incomeController = require('../controllers/incomeController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.post('/create-income/:shopId',authController.protect, incomeController.createIncome)
router.patch('/update-income/:incomeId', authController.protect,incomeController.updateIncome)
router.delete('/delete-income/:incomeId',authController.protect, incomeController.deleteIncome)

router.get('/daily-income/:shopId',authController.protect,incomeController.dailyIncome)
router.get('/income/weeklyincome/:shopId',authController.protect,incomeController.weeklyIncome)
router.get('/income/monthlyincome/:shopId',authController.protect,incomeController.monthlyIncome)
router.get('/income/yearlyincome/:shopId',authController.protect,incomeController.yearlyIncome)


module.exports=router;







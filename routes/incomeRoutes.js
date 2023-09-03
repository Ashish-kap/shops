const express = require('express');
const incomeController = require('../controllers/incomeController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.post('/create-income/:shopId', incomeController.createIncome)
router.patch('/update-income/:incomeId', incomeController.updateIncome)
router.delete('/delete-income/:incomeId', incomeController.deleteIncome)

router.get('/daily-income/:shopId',incomeController.dailyIncome)
router.get('/income/weeklyincome/:shopId',incomeController.weeklyIncome)
router.get('/income/monthlyincome/:shopId',incomeController.monthlyIncome)
router.get('/income/yearlyincome/:shopId',incomeController.yearlyIncome)


module.exports=router;







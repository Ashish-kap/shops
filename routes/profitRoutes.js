const express = require('express');
const profitController = require('../controllers/profitController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.get('/daily-profit-by-shop/:shopId',profitController.dailyProfitByShop)
router.get('/weekly-profit-by-shop/:shopId',profitController.weeklyProfitByShop)
router.get('/monthly-profit-by-shop/:shopId',profitController.monthlyProfitByShop)
router.get('/yearly-profit-by-shop/:shopId',profitController.yearlyProfitByShop)

router.get('/get-all-basic-expenses/:shopId',profitController.allBasicExpenses)
router.get('/shop/:shopId/get-all-employee-expenses/:employeeId',profitController.allEmployeeExpenses)
router.get('/shop/:shopId/get-all-vendor-expenses/:vendorId',profitController.allVendorExpenses)
router.get('/get-all-income/:shopId',profitController.allIncome)

router.get('/all-expenses-by-shop/:shopId',profitController.allExpenses)
router.get('/demo/:shopId',profitController.demo)

router.get('/select-period',profitController.selectPeriod)
router.get('/select-period-for-shop/:shopId',profitController.selectPeriodForShop)

router.get('/daily-profit',profitController.dailyProfit)
router.get('/weekly-profit',profitController.weeklyProfit)
router.get('/monthly-profit',profitController.monthlyProfit)
router.get('/yearly-profit',profitController.yearlyProfit)


module.exports=router;







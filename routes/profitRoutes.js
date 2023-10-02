const express = require('express');
const profitController = require('../controllers/profitController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.get('/daily-profit-by-shop/:shopId',authController.protect,profitController.dailyProfitByShop)
router.get('/weekly-profit-by-shop/:shopId',authController.protect,profitController.weeklyProfitByShop)
router.get('/monthly-profit-by-shop/:shopId',authController.protect,profitController.monthlyProfitByShop)
router.get('/yearly-profit-by-shop/:shopId',authController.protect,profitController.yearlyProfitByShop)

router.get('/get-all-basic-expenses/:shopId',authController.protect,profitController.allBasicExpenses)
router.get('/shop/:shopId/get-all-employee-expenses/:employeeId',authController.protect,profitController.allEmployeeExpenses)
router.get('/shop/get-all-vendor-expenses/:vendorId',authController.protect,profitController.allVendorExpenses)
router.get('/get-all-income/:shopId',authController.protect,profitController.allIncome)

router.get('/all-expenses-by-shop/:shopId',authController.protect,profitController.allExpenses)
router.get('/demo/:shopId/:userId',profitController.demo)

router.get('/select-period',authController.protect,profitController.selectPeriod)
router.get('/select-period-for-shop/:shopId',authController.protect,profitController.selectPeriodForShop)

router.get('/daily-profit',authController.protect,profitController.dailyProfit)
router.get('/weekly-profit',authController.protect,profitController.weeklyProfit)
router.get('/monthly-profit',authController.protect,profitController.monthlyProfit)
router.get('/yearly-profit',authController.protect,profitController.yearlyProfit)


module.exports=router;







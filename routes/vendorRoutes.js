const express = require('express');
const vendorController = require('../controllers/vendorController.js');
const registerVendorController = require('../controllers/registerVendorController.js');
const authController = require('../controllers/authController.js');


const router = express.Router();

router.post('/shops/:shopId/vendor-expenses/:vendorId',authController.protect,vendorController.createVenderExpense)
router.patch('/vendor-expenses/:expenseId',authController.protect,vendorController.updateVenderExpense)
router.delete('/delete-vendor-expenses/:expenseId',authController.protect,vendorController.deleteVendorExpense)


router.get('/daily-vendor-expenses/:shopId',authController.protect,vendorController.dailyBasicExpense)
router.get('/vendor-expenses/weeklyVendorExpense/:shopId',authController.protect,vendorController.weeklyBasicExpense)
router.get('/vendor-expenses/monthlyVendorExpense/:shopId',authController.protect,vendorController.monthlyBasicExpense)
router.get('/vendor-expenses/yearlyVendorExpense/:shopId',authController.protect,vendorController.yearlyBasicExpense)


// register vendor

router.post('/register-vendors/:shopId',authController.protect,registerVendorController.registerVendor)
router.get('/get-register-vendors/:shopId',authController.protect,registerVendorController.getRegisterVendors)

module.exports =router;







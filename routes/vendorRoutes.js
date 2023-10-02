const express = require('express');
const vendorController = require('../controllers/vendorController.js');
const registerVendorController = require('../controllers/registerVendorController.js');
const authController = require('../controllers/authController.js');


const router = express.Router();

router.post('/shops/vendor-expenses/:vendorId',authController.protect,vendorController.createVenderExpense)
router.patch('/vendor-expenses/:expenseId',authController.protect,vendorController.updateVenderExpense)
router.delete('/delete-vendor-expenses/:expenseId',authController.protect,vendorController.deleteVendorExpense)


router.get('/daily-vendor-expenses',authController.protect,vendorController.dailyBasicExpense)
router.get('/vendor-expenses/weeklyVendorExpense',authController.protect,vendorController.weeklyBasicExpense)
router.get('/vendor-expenses/monthlyVendorExpense',authController.protect,vendorController.monthlyBasicExpense)
router.get('/vendor-expenses/yearlyVendorExpense',authController.protect,vendorController.yearlyBasicExpense)


// register vendor
router.post('/register-vendors',authController.protect,registerVendorController.registerVendor)
router.delete('/delete-vendor/:vendorId',authController.protect,registerVendorController.deleteVendor)
router.get('/get-register-vendors',authController.protect,registerVendorController.getRegisterVendors)

module.exports =router;




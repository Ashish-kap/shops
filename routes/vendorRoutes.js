const express = require('express');
const vendorController = require('../controllers/vendorController.js');
const registerVendorController = require('../controllers/registerVendorController.js');
const authController = require('../controllers/authController.js');


const router = express.Router();

router.post('/shops/:shopId/vendor-expenses/:vendorId',vendorController.createVenderExpense)
router.patch('/vendor-expenses/:expenseId',vendorController.updateVenderExpense)
router.delete('/delete-vendor-expenses/:expenseId',vendorController.deleteVendorExpense)


router.get('/daily-vendor-expenses/:shopId',vendorController.dailyBasicExpense)
router.get('/vendor-expenses/weeklyVendorExpense/:shopId',vendorController.weeklyBasicExpense)
router.get('/vendor-expenses/monthlyVendorExpense/:shopId',vendorController.monthlyBasicExpense)
router.get('/vendor-expenses/yearlyVendorExpense/:shopId',vendorController.yearlyBasicExpense)


// register vendor

router.post('/register-vendors/:shopId',registerVendorController.registerVendor)
router.get('/get-register-vendors/:shopId',registerVendorController.getRegisterVendors)

module.exports =router;







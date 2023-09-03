const express = require('express');
const viewController = require('../controllers/viewController.js');
const authController = require('../controllers/authController.js');
const router = express.Router();

router.get('/',viewController.home)
router.get('/all-employees/:shopId',viewController.allEmployess)
router.get('/all-vendors/:shopId',viewController.allVendors)
router.get('/shop-overview/:shopId',viewController.shop)
router.get('/shop/:shopId/employee-details/:employeeId',viewController.viewEmployee)
router.get('/shop/:shopId/vendor-details/:vendorId',viewController.viewVendors)

module.exports =router;







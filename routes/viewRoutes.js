const express = require('express');
const viewController = require('../controllers/viewController.js');
const authController = require('../controllers/authController.js');
const router = express.Router();


router.post('/user-signup',authController.signupp)
router.post('/user-login',authController.loginWithPassword)

router.get('/',viewController.home)
router.get('/dashboard',viewController.dashBoard)
router.get('/signup',viewController.signup)
router.get('/all-employees/:shopId',viewController.allEmployess)
router.get('/all-vendors/:shopId',viewController.allVendors)
router.get('/shop-overview/:shopId',viewController.shop)
router.get('/shop/:shopId/employee-details/:employeeId',viewController.viewEmployee)
router.get('/shop/:shopId/vendor-details/:vendorId',viewController.viewVendors)

module.exports =router;







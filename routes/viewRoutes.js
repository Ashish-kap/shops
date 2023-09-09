const express = require('express');
const viewController = require('../controllers/viewController.js');
const authController = require('../controllers/authController.js');
const router = express.Router();


router.post('/user-signup',authController.signupp)
router.post('/user-login',authController.loginWithPassword)

router.get('/',viewController.home)
router.get('/dashboard',authController.protect,viewController.dashBoard)
router.get('/signup',authController.protect,viewController.signup)
router.get('/all-employees/:shopId',authController.protect,viewController.allEmployess)
router.get('/all-vendors/:shopId',authController.protect,viewController.allVendors)
router.get('/shop-overview/:shopId',authController.protect,viewController.shop)
router.get('/shop/:shopId/employee-details/:employeeId',authController.protect,viewController.viewEmployee)
router.get('/shop/:shopId/vendor-details/:vendorId',authController.protect,viewController.viewVendors)

module.exports =router;







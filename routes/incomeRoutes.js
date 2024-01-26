const express = require('express');
const incomeController = require('../controllers/incomeController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.post('/create-income/:shopId',authController.protect, incomeController.createIncome)
router.patch('/update-income/:incomeId', authController.protect,incomeController.updateIncome)
router.delete('/delete-income/:incomeId',authController.protect, incomeController.deleteIncome)

router.get('/get/all/billnumbers',authController.protect,incomeController.getAllBillNumbers)
router.get('/get/hisab/:shopId',authController.protect,incomeController.hisab)

module.exports=router;







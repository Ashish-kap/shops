const express = require('express');
const shopController = require('../controllers/shopController.js');
const authController = require('../controllers/authController.js');


const router = express.Router();
router.get('/all-shops',authController.protect,shopController.allShops)
router.post('/create-shop',authController.protect,shopController.createShop)
router.delete('/delete-shop/:shopId',authController.protect,shopController.deleteShop)

module.exports=router;




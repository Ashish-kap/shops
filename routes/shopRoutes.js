const express = require('express');
const shopController = require('../controllers/shopController.js');
const authController = require('../controllers/authController.js');


const router = express.Router();
router.get('/all-shops',shopController.allShops)
router.post('/create-shop',shopController.createShop)
router.patch('/update-shop/:id',shopController.updateShop)

module.exports =router;




const express = require("express");
const router = express.Router();
const userSendCreateStoreProduct = require('../../controllers/userSendCreateStoreProduct')
const siteStatusController = require('../../controllers/switchSite.controller')
const {createUser, auth} = require('../../controllers/user.controller')

router.get('/all-create-store-product', userSendCreateStoreProduct.sendAllCreateStoreProduct)

router.get('/status',siteStatusController.readStatus)
router.post('/create-user',createUser)
router.post('/auth',auth)

module.exports = router;
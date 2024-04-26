const express = require("express");
const router = express.Router();
const adverModel = require("../../models/advert");
const advertController = require("../../controllers/advertController");
const siteStatusController = require('../../controllers/switchSite.controller')
const officialStoreController = require('../../controllers/officialStoreController')
const officialStoreProductController = require('../../controllers/officialStoreProductController')
const createStoreProductController = require('../../controllers/createStoreProductController')
const createStoreController = require('../../controllers/createStoreController')
const createCategoryController = require('../../controllers/createCategory')
const upload = require('../files')
const jsonAuth = require("../../middleware/requireAuth");



router.use(jsonAuth);
//start advet ------------------------------------------------------------------------------------
router.post(
  "/create-advert",
  upload.single("file"),
  advertController.createAdvertController
);
router.get("/get-advert",advertController.readAdvertController);
router.delete("/delete-advert/:id",advertController.deleteAdvertController);
//end ---------------------------------------------------------------------------------------------

//website status ----------------------------------------------------------------------------------
router.post('/status/:id',siteStatusController.createStatus)
router.get('/status',siteStatusController.readStatus)
//end----------------------------------------------------------------------------------------------

//start official store ----------------------------------------------------------------------------
router.post('/create-official-store',upload.single("file"),officialStoreController.createOfficialStore)
router.get('/read-official-store',officialStoreController.readOfficialStore)
router.put('/update-official-store',officialStoreController.updateOfficialStore)
router.delete('/delete-official-store/:id',officialStoreController.deleteOfficialStore)
//store products
router.post('/create-official-store-product',upload.single("file"),officialStoreProductController.createStoreProduct)
router.get('/get-official-store-products/:id', officialStoreProductController.getOfficialStoreProducts);
router.patch('/update-official-store-product',upload.single("file"), officialStoreProductController.updateOfficialStoreProduct);
router.delete('/delete-official-store-product/:storeId/:productId', officialStoreProductController.deleteOfficialStoreProduct);
//end official store ------------------------------------------------------------------------------

//start create store -------------------------------------------------------------------------------
router.post('/create-store',createStoreController.createStore)
router.get('/read-create-store',createStoreController.readCreateStore)
router.put('/update-create-store',createStoreController.updateCreateStore)
router.delete('/delete-create-store/:id',createStoreController.deleteCreateStore)

//create categories
router.post('/create-category',createCategoryController.createCategory)
router.get('/read-categories',createCategoryController.readCategory)
router.delete('/delete-category/:id',createCategoryController.deleteCategory)


//store products
router.post('/create-create-store-product',upload.single("file"),createStoreProductController.createStoreProduct)
router.get('/get-create-store-products/:id', createStoreProductController.getCreateStoreProducts);
router.patch('/update-create-store-product',upload.single("file"), createStoreProductController.updateCreateStoreProduct);
router.delete('/delete-create-store-product/:storeId/:productId', createStoreProductController.deleteCreateStoreProduct);
//end-----------------------------------------------------------------------------------------------






//users --------------------------------------------------------------------------------------------------------------------

module.exports = router;
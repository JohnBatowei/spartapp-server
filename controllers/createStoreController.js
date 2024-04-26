const createStoreModel = require("../models/createStore");
const categoryModel = require("../models/categories");
const deleteUploadImage = require("../deleteImage");
const productModel = require("../models/product");

module.exports.createStore = async function(req, res) {
  try {
    // console.log(req.admin)
    // console.log(req)
    // const findStoreDesign = await createStoreModel.findOne({storeDesign : req.body.storeDesign})
    // if(findStoreDesign){
    //   return res.status(200).json({ message: "Store Design already exist" });
    // }
    const data = new createStoreModel({
    storeDesign: req.body.storeDesign,
      storeDescriptionName: req.body.storeDesc,
      userId : req.admin
    });
    data.save().then(data => {
      if (data) {
        return res.status(200).json({ message: `Your store has been created successful` });
      }
      return res.status(404).json({ message: "Ooops creating store was unsuccessful" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable create store : server error" });
  }
};


module.exports.readCreateStore = async function(req, res) {
  try {
    const data = await createStoreModel.find().sort({ createdAt: -1 });
    const category = await categoryModel.find().lean()

    if (data.length > 0 && category) {
      const formattedData = data.map(item => ({
        _id: item._id,
        name: item.storeDescriptionName,
        storeDesign:item.storeDesign
        // image: `${req.protocol}://${req.get("host")}/uploads/${item.image}`
      }));

      return res.status(200).json({ message: formattedData , category});
    } else {
      return res.status(400).json({ message: "No adverts found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateCreateStore = async function(req, res) {

};


module.exports.deleteCreateStore = async function(req, res) {
  try {
    const itemId = req.params.id; // Get the item ID from the request parameters
    // console.log(itemId);

    // Find the advertisement by its ID
    const store = await createStoreModel.findById(itemId).populate('products');
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Delete all associated products and their images
    for (const product of store.products) {
      const delProduct = await productModel.findByIdAndDelete(product._id)
      deleteUploadImage(delProduct.image);
      // console.log('the image loop')
    }
    
    // Remove the store
    const deletedStore = await createStoreModel.findByIdAndDelete(itemId);
    // deleteUploadImage(deletedStore.image);
// console.log(deletedStore)
    if (deletedStore) {
      return res.status(200).json({ message: `${deletedStore.storeDescriptionName} and its products successfully deleted` });
    } else {
      return res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete store and its products: server error' });
  }
};
const officialStoreModel = require("../models/officialStore");
const deleteUploadImage = require("../deleteImage");
const categoryModel = require("../models/categories");
const productModel = require("../models/product");


module.exports.createOfficialStore = async function(req, res) {
  try {
    const data = new officialStoreModel({
      name: req.body.name,
      image: req.file.filename,
      userId : req.admin
    });
    data.save().then(data => {
      if (data) {
        return res.status(200).json({ message: "Store created successful" });
      }
      return res.status(404).json({ message: "Ooops unsuccessful" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to save file : server error" });
  }
};


module.exports.readOfficialStore = async function(req, res) {
  try {
    const data = await officialStoreModel.find().sort({ createdAt: -1 });
    const category = await categoryModel.find().lean()
    if (data.length > 0 && category) {
      const formattedData = data.map(item => ({
        _id: item._id,
        name: item.name,
        image: `${req.protocol}://${req.get("host")}/uploads/${item.image}`
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

module.exports.updateOfficialStore = async function(req, res) {

};


module.exports.deleteOfficialStore = async function(req, res) {
  try {
    const itemId = req.params.id; // Get the item ID from the request parameters
    // console.log(itemId);

    // Find the advertisement by its ID
    const store = await officialStoreModel.findById(itemId).populate('products');
    // console.log(store)
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Delete all associated products and their images

    for (const product of store.products) {
      const delProduct = await productModel.findByIdAndDelete(product._id)
      deleteUploadImage(delProduct.image);
      // console.log('the image official loop')
    }
    
    // Remove the store
    const deletedStore = await officialStoreModel.findByIdAndDelete(itemId);
    deleteUploadImage(deletedStore.image);
// console.log(deletedStore)
    if (deletedStore) {
      return res.status(200).json({ message: `${deletedStore.name} store and its products successfully deleted` });
    } else {
      return res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete store and its products: server error' });
  }
};

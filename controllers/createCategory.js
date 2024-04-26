const createStoreModel = require("../models/createStore");
const deleteUploadImage = require("../deleteImage");
const categoryModel = require("../models/categories");

module.exports.createCategory = async function(req, res) {
  try {
    const catName = req.body.categoryName.toLowerCase()
    const data = await categoryModel.findOne({categoryName: catName})
    if(data){
     return res.status(404).json({message: `${req.body.categoryName} already exist`})
    }
    const form = new categoryModel({categoryName: catName})
    const success = await form.save()
    if(success){
      res.status(200).json({message: `${success.categoryName} created successfully`})
      console.log(success)
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable create store : server error" });
  }
};


module.exports.readCategory = async function(req, res) {
  try {
   
    const category = await categoryModel.find().sort({createdAt : -1}).lean()

    if (category) {
      // console.log(category)
      return res.status(200).json({ message: category});
    } else {
      return res.status(400).json({ message: "No adverts found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};


module.exports.deleteCategory = async function(req, res) {
  try {
    const categoryId = req.params.id; 
    const deleteCategory = await categoryModel.findByIdAndDelete(categoryId);
    if (deleteCategory) {
      return res.status(200).json({ message: `${deleteCategory.categoryName} successfully deleted` });
    } else {
      return res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete category: server error' });
  }
};
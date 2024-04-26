const fs = require('fs');
const path = require('path');
const advertModel = require('../models/advert');
const deleteUploadImage = require('../deleteImage');


module.exports.createAdvertController = async(req,res)=>{
    try {
        
      const data = new advertModel({
            image: req.file.filename,
            screen : req.body.screen
        })
      data.save().then((data)=>{
            if(data){
             return res.status(200).json({message : 'Upload successful'})
            }
            return res.status(404).json({message : 'Upload unsuccessful'})
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'unable to save file : server error'})
    }
}


module.exports.readAdvertController = async (req, res) => {
    try {
      const data = await advertModel.find().sort({createdAt : -1});
  
      if (data.length > 0) {
        const formattedData = data.map((item) => ({
          _id: item._id,
          image: `${req.protocol}://${req.get("host")}/uploads/${item.image}`,
          screenType: item.screen,
        }));
  
        return res.status(200).json({message: formattedData});
      } else {
        return res.status(400).json({ message: 'No adverts found' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
  


module.exports.updateAdvertController = (req,res)=>{
    try {
        res.json({message: 'server is aware'})
    } catch (error) {
        console.log(error)
    }
}





module.exports.deleteAdvertController = async (req, res) => {
  try {
    const itemId = req.params.id; // Get the item ID from the request parameters
    console.log(itemId)

    // Find the advertisement by its ID and remove it
    const deletedItem = await advertModel.findByIdAndDelete(itemId);
    if (deletedItem) {
     deleteUploadImage(deletedItem.image)
     return res.status(200).json({ message: 'File successfully deleted' });
    } else {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete advertisement and image: server error' });
  }
};


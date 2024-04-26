const mongoose = require("mongoose");
const db = require("../dbConfig/config");

const createStoreSchema = new mongoose.Schema(
  {
    storeDesign: {
        type: String,
        required:true,
    },
    storeDescriptionName: { type: String },
    products: [ { type: mongoose.Schema.Types.ObjectId, ref: 'product'} ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin'},
  },
  { timestamps: true }
);


const createStoreModel = db.spartapp.model(
  "createStore",
  createStoreSchema
);
module.exports = createStoreModel;

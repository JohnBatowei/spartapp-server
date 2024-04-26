const mongoose = require("mongoose");
const db = require("../dbConfig/config");

const product = new mongoose.Schema(
  {
      categoryName: { type: String },
      storeId: { type: mongoose.Schema.Types.ObjectId, ref: "createStore", required: true },
      storeIdOff: { type: mongoose.Schema.Types.ObjectId, ref: "officialStore"},
      image: { type: String },
      productName: { type: String, required: true },
      amount: { type: Number, required: true },
      discountPercentage: { type: Number, default: 0 },
      discountedAmount: { type: Number, default: 0 },
      discounted: { type: Boolean, default: false },
      quantity: { type: Number, default: 1 },
      quantityLeft: { type: Number, default: 1 },
      productType: { type: String },
      storeDesign: { type: String },
      storeDescriptionName: { type: String },
      initialAmount: { type: Number },
      details: { type: String },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    
  },
  { timestamps: true }
);

const productModel = db.spartapp.model("product", product);
module.exports = productModel;

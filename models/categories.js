const mongoose = require("mongoose");
const db = require("../dbConfig/config");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {type: String,required: true},
  },
  { timestamps: true }
);


const categoryModel = db.spartapp.model(
  "category",
  categorySchema
);

module.exports = categoryModel;

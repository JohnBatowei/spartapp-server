const mongoose = require("mongoose");
const db = require("../dbConfig/config");

const officialStoreSchema = new mongoose.Schema(
  {
    image:{ type: String },
    name:{ type: String },
    products: [ { type: mongoose.Schema.Types.ObjectId, ref: 'product'} ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin'},
  },
  { timestamps: true }
);


const officialStoreModel = db.spartapp.model(
  "officialStore",
  officialStoreSchema
);
module.exports = officialStoreModel;

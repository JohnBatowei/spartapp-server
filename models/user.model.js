const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const db = require("../dbConfig/config");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "users"
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true // Remove unnecessary array brackets
    },
    image: {
      type: String
    },
    transanctions :[{
        storeId: { type: String, required: true },
        productId: { type: String, required: true },
        productImage: String,
        productName: { type: String, required: true },
        amount: { type: Number, required: true },
        discountPercentage: { type: Number, default: 0 },
        Amount: { type: Number, default: 0 },
        discounted: { type: Boolean, default: false },
        quantity:{ type:Number, default: 1},
        productType:{ type:String},
    }]
  },
  { timestamps: true }
);

adminSchema.pre("save", async function(next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Handle errors properly
  }
});



const userModel = db.spartapp.model("spartappUser", adminSchema);
// const userModel = mongoose.model("admin", adminSchema);
module.exports = userModel
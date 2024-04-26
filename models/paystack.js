const mongoose = require("mongoose");
const db = require('../dbConfig/config');

const paystackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    transactionReferenceNum: { type: String, required: true },
    address: {
      state: { type: String, required: true },
      city: { type: String, required: true },
      addressType: { type: String, required: true },
    },
    cart: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
}, { timestamps: true });



const PaymentDetails = db.spartapp.model("PaymentDetails", paystackSchema);
module.exports = PaymentDetails
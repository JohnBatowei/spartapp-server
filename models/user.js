const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const db = require('../dbConfig/config');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true, // Remove unnecessary array brackets
    },
  
}, { timestamps: true });



userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Handle errors properly
    }
});

userSchema.post('save', function (doc, next) {
  console.log('New user was saved');
  next();
});



const userModel = db.spartapp.model("user", userSchema);
// const userModel = mongoose.model("user", userSchema);
module.exports = userModel
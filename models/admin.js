const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const db = require("../dbConfig/config");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Admin"
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
    role:{
      type: String,
      default: 'user',
    }
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

adminSchema.post("save", function(doc, next) {
  console.log("New user was saved");
  next(); // Add error handling if needed
});

adminSchema.post("save", function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    // Duplicate key error (e.g., duplicate email)
    next(new Error("Email already exists"));
  } else {
    next(error); // Forward other errors
  }
});


adminSchema.statics.login = async function(email, password) {
  try {
    const admin = await this.findOne({ email });
    if (!admin) {
      throw new Error("Incorrect Email"); // Throw an error object
    }
    const auth = await bcrypt.compare(password,admin.password);
    console.log("Password comparison result:", auth);
    if (!auth) {
      throw new Error("Incorrect Password");
    }
    // Update lastActivityTimestamp on successful login
    admin.lastActivityTimestamp = new Date();
    await admin.save();
    //--------------------------------------------------------------------
    return admin;
  } catch (error) {
    throw error;
  }
};

const adminModel = db.spartapp.model("admin", adminSchema);
// const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;

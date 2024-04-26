const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const adminModel = require("../models/admin");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const upload = require("./files");
const deleteUploadImage = require("../deleteImage");
const userModel = require("../models/user");
// const createToken = require("../middleware/createToken");


// const maxAge = 3 * 24 * 60 * 60;
const createToken = id => {
  // 1st parameter is the payload, 2nd is the secret
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: '1d'
  });
};


router.get("/", (req, res) => {
  // res.json({message:'successful'})
  res.status(200).render("admin");
});


router.post("/", upload.single("file"), async (req, res) => {
  try {
  
    // console.log('testing ', req.files);
    const findAdmin = await adminModel.findOne({ email: req.body.email });
    if (!findAdmin) {
      let form = new adminModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        image: req.files.filename
      });
      form.save().then(data => {
        let token = createToken(data._id);
        res.status(200).json({ message: `${data.name} is now an admin`, token });
        // res.status(200).json({ message: `${data.name} is now an admin`});
      });
    } else {
      deleteUploadImage(req.files.filename)
      res.status(400).json({ message: `${req.body.email} already exists` });
      // deleteFilesNotInDatabase()
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message }); // Include the error message in the response
  }
});


router.post("/verify", async (req, res) => {
  try {
    const { email, password } = req.body;
    // const admin = await adminModel.login(email, password);
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      throw new Error("Incorrect Email"); // Throw an error object
    }
    const auth = await bcrypt.compare(password, admin.password);
    // const auth = await authPromise;
    // console.log("Password comparison result:", auth);
    if (!auth) {
      throw new Error("Incorrect Password");
    }

    const token = createToken(admin._id);
    const image = `${req.protocol}://${req.get("host")}/uploads/${admin.image}`;

    res.status(200).json({ name: admin.name, email, token, image });
  } catch (error) {
    if (error.message === "Incorrect Email") {
      res.status(404).json({ message: "Email is not registered" });
    } else if (error.message === "Incorrect Password") {
      res.status(400).json({ message: "Password is incorrect" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});


router.get("/logout", (req, res) => {
  res.cookie("AriTron", "", { maxAge: 1 });
  res.status(200).json({ message: "successful" });
});

router.use(requireAuth);

router.get("/:id", async (req, res) => {
  // not to make the server break down or mongoose throwing an error to the server
  // verify if it a valid mongoose id
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "invalid input" });
  }
});


//users
router.post("/users", async (req, res) => {
  try {
    // console.log('testing ', req.files);
    const finduser = await userModel.findOne({ email: req.body.email });
    if (!finduser) {
      let form = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      form.save().then(data => {
        let token = createToken(data._id);
        res.status(200).json({ message: `${data.name} can now use spartapp`, token });
      });
    } else {
      res.status(400).json({ message: `${req.body.email} already exists` });
      // deleteFilesNotInDatabase()
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message }); // Include the error message in the response
  }
});


router.post("/users-verify", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.login(email, password);
    let token = createToken(user._id);
    // const image = `${req.protocol}://${req.get("host")}/uploads/${user.image}`;
    res.status(200).json({ name: user.name, email, token });
  } catch (error) {
    if (error.message === "Incorrect Email") {
      res.status(404).json({ message: "Email is not registered" });
    } else if (error.message === "Incorrect Password") {
      res.status(400).json({ message: "Password is incorrect" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

module.exports = router;
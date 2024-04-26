const userModel = require('../models/user.model')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



const createToken = id => {
  // 1st parameter is the payload, 2nd is the secret
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: '1d'
  });
};



module.exports.createUser =  async (req, res) => {
    try {
    
      console.log(req.body);
      
      const finduser = await userModel.findOne({ email: req.body.email });
      console.log(finduser);
      if (!finduser) {
        let form = new userModel({
            email: req.body.email,
            password: req.body.password,
        });
        const data = await form.save()
          let token = createToken(data._id);
          res.status(200).json({ message: `${data.email} can now use spartapp`, token });
  
      } else {
        res.status(400).json({ message: `${req.body.email} already exists` });
        // deleteFilesNotInDatabase()
      }
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message }); // Include the error message in the response
    }
  };
  


module.exports.auth = async (req, res) => {
    try {
      console.log(req.body)
      const { email, password } = req.body;
      // const admin = await userModel.login(email, password);
      const admin = await userModel.findOne({ email });
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
      // const image = `${req.protocol}://${req.get("host")}/uploads/${admin.image}`;
  
      res.status(200).json({ email, token });
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
  };
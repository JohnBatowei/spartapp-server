const settingModel = require("../models/site.status")


module.exports.createStatus = async function(req, res) {
    try {
        // Find the existing status document
        const status = await settingModel.findOne();

        if (!status) {
            // If the status document doesn't exist, create a new one with default value true
            const data = new settingModel({ status: true });
            data.save().then(data => {
                if (data) {
                    return res.status(200).json({ message: 'Site status set to true' });
                }
            });
        } else {
            // Update the existing status document with the value from the request parameters
            status.status = req.params.id;
            status.save().then((data) => {
                const message = data.status == true ? 'Site status has been toggled to ON': 'Site status has been toggled OFF'
                return res.status(200).json({ message: message });
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};




module.exports.readStatus = async function(req, res) {
    try {
       const allStatus = await settingModel.find({});
       if(allStatus){
        res.status(200).json({message: allStatus});
       }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({message: error.message});
    }
};


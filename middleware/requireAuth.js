const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin");


const requireAuth = async (req,res,next)=>{
//    console.log('i am working')
    // verify authorization
    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({message: 'You are not authorize'})
    }
   
    // 'Bearer uiytiydgkjhuirshthit.jhruishrtshutijkbfyutb.yoioyilfkhofyifk'
    // it comes like this in the string above, so we are using the split array method to grab just the token from the string

    const token = authorization.split(' ')[1]

    try {
        const {id} = jwt.verify(token, process.env.SECRET)
        const admin = await adminModel.findOne({id}).select('_id')
        if(!admin){
           return res.status(401).json({ message: 'Unauthorized' });
        }
        req.admin = admin
        next()
    } catch (error) {
        // console.log(error)
        // res.status(401).json({message: 'Request not authorized'})
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token has expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = requireAuth
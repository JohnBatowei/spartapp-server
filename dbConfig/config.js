const mongoose = require('mongoose')


// const adminDB_url = process.env.adminDb_url
// const product_url = process.env.product_url
// const user_url = process.env.user_url
// const settings = process.env.settings
// const paystack = process.env.paystack
const spartapp = process.env.spartapp

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true ,
}
mongoose.set('strictQuery', true);

mongoose.spartapp = mongoose.createConnection(spartapp,connectionParams)
// mongoose.admin = mongoose.createConnection(adminDB_url,connectionParams)
// mongoose.products = mongoose.createConnection(product_url,connectionParams)
// mongoose.users = mongoose.createConnection(user_url,connectionParams)
// mongoose.settings = mongoose.createConnection(settings,connectionParams)
// mongoose.paystack = mongoose.createConnection(paystack,connectionParams)


module.exports = mongoose
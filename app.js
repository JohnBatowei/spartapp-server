const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

var path = require("path");


const app = express();
const port = 3800 || process.env.PORT;


// custom routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
const paystackRouter = require("./routes/paystack");
const apiRouter = require('./routes/adminPanelHandler/api')
const userApiRouter = require('./routes/adminPanelHandler/userApi')



app.use(cors());
app.options("*", cors());


app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");



app.use("/paystack", paystackRouter);
// custom routes
app.use('/spart-users',userApiRouter)
app.use("/", indexRouter);
app.use('/api',apiRouter)
// app.use('/spart-users',userApiRouter)
app.use("/users", usersRouter);



const connect = require('./dbConfig/config')
// console.log(connect)
async function connectDB(conn){
const connected = await conn
if(connected){
  return console.log('connected to my db')
}else{
  return console.log('unable to connect')
}
}
connectDB(connect)


app.listen(port, () => {
  console.log("server is up");
});

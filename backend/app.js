const express = require('express');
const app =express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middleware/error');
const order = require('./routes/orderRoute');



 const path = require('path');

 if(process.env.NODE_ENV!=="PRODUCTION"){
    require('dotenv').config({path:"backend/config/config.env"})
  }
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload());
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const payment = require("./routes/paymentRoute");
app.use("/api/v1",product);
app.use(errorMiddleware);
app.use("/api/v1",user);
app.use("/api/v1",order)
app.use("/api/v1",payment)
app.use(express.static(path.join(__dirname,"../frontend/build")))
app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"));
})
module.exports =app;
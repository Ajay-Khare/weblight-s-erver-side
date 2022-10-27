const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080
const env = require('dotenv').config()
const router = require("./API's/routers")
app.use(router)

// connection with DB
mongoose.connect("mongodb://localhost:27017/EcomApp", (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("connected to DB")
    }
})

//text api
app.get("/testApi", (req, res) => {
    res.send("hello")
})

// express server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
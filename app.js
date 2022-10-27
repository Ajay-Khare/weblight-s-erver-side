const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080
const dotenv = require("dotenv");
app.use(dotenv).config()

// connection with DB
mongoose.connect("mongodb://localhost:27017/", (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("connected to DB")
    }
})

// express server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
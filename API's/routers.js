const mongoose = require("mongoose");
const express = require("express")
const router = express.Router();
router.use(express.json());
const products = require("../models/product");
const user = require("../models/user")
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const cors = require("cors")
router.use(cors());


// test api for router
router.get("/", (req, res) => {
    res.send("hello from router")
})


// filling data in our DataBase throgh online test API
// async function fillData(api) {
//     const data = await products.find();
//     if (data.length < 1) {
//         data.map(async ele => {
//             console.log(ele)
//             await products.create({
//                 title: ele.title,
//                 price: ele.price,
//                 category: ele.category,
//                 description: ele.description,
//                 image: ele.image,
//                 rating:ele.rating.rate
//             })
//         })
//     }
//     console.log("executed")
// }
// const api = "https://fakestoreapi.com/products"
// fillData(api)


router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    // console.log(req.body)
    const data = await user.findOne({ email });
    if (data) {
        return res.send({ message: "user allready registered" });
    }

    bcrypt.hash(password, 10, async function (err, hash) {
        // Store hash in your password DB.
        if (err) {
            return res.send(err.message)
        }
        const newUser = await user.create({
            name,
            email,
            password: hash
        })
        res.send({ message: "success" })
    });

})


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const data = await user.findOne({ email });
    if (!data) {
        return res.send({ message: "USER NOT REGISTERED" })
    }
    const hash = data.password;

    bcrypt.compare(password, hash, async function (err, result) {
        // result == true
        if (err) {
            return res.send(err.message)
        }
        if (!result) {
            return res.send("Incorrect Password")
        }
        const token = await jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: data._id
        }, 'secret');
        res.send({ message: "success", token })
    });
})


module.exports = router
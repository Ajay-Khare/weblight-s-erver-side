const mongoose = require("mongoose");
const express = require("express")
const router = express.Router();
router.use(express.json());
const products = require("../models/product");
const cart = require("../models/userCart");
const user = require("../models/user")
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const cors = require("cors")
const { validateToken } = require("../middleware/athentication");
router.use(cors());


// test api for router
router.get("/", (req, res) => {
    res.send("hello from router")
})


// API to register new user
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
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


// API for login existing user.
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


// API to handle requests related to cart.
router.post("/cart", validateToken, async (req, res) => {
    const { product } = req.body;
    const userCart = await cart.find({ $and: [ {userid: req.user}, {product: product} ] })
    if (userCart.length === 0) {
        if (product) {
            const data = await cart.create({
                userid: req.user,
                product: product
            })
            res.send({ message: "success" })
        }
        else {
            res.send({ message: "empty data" })
        }
    }
    else {
        res.send({message:"item allready exist in cart"})
    }


})

router.get("/cart", validateToken, async (req, res) => {
    const data = await cart.find({ userid: req.user });
    res.send(data)
})

module.exports = router
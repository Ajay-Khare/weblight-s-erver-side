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
            return res.send({message:"Incorrect Password"})
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
    const { product, price } = req.body;
    const userCart = await cart.find({ $and: [{ userid: req.user }, { product: product }, { purchaseStatus: false }] })
    if (userCart.length === 0) {
        if (product) {
            const data = await cart.create({
                userid: req.user,
                product: product,
                price
            })
            res.send({ message: "success" })
        }
        else {
            res.send({ message: "empty data" })
        }
    }
    else {
        res.send({ message: "item allready exist in cart" })
    }


})

router.get("/cart", validateToken, async (req, res) => {
    const data = await cart.find({ $and: [{ userid: req.user }, { purchaseStatus: false }] });
    res.send(data)
})

router.patch("/quantity", validateToken, async (req, res) => {
    const { qty, id } = req.body;
    const oldData = await cart.findOne({ _id: id });
    let oldQty = oldData.quantity;
    if (qty) {
        const data = await cart.updateOne({ _id: id }, { quantity: oldQty + 1 });
        res.send({ message: "success" });
    }
    if (!qty && oldData.quantity > 1) {
        const data = await cart.updateOne({ _id: id }, { quantity: oldQty - 1 });
        res.send({ message: "success" });
    }
})

router.patch("/purchase", validateToken, async (req, res) => {
    const cartData = await cart.find({ userid: req.user });
    if (cartData) {
        const data = await cart.updateMany({ userid: req.user }, { purchaseStatus: true });
        res.send({ message: "success" });
    }
    else {
        res.send({ message: "no data found in cart" });
    }
})

router.get("/purchaseHistory",validateToken,async (req, res) => {
    try {
        const data = await cart.find({ $: [{ userid: req.user }, { purchaseStatus: true }] });
        if (data.length === 0) {
            return res.status(200).send({message:"no data available"})
        }
        res.status(200).send({message:"data available", data});
    } catch (error) {
        res.status(400).send(err.message)
    }
})

module.exports = router
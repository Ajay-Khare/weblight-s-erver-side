const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    rating: Number
})

const products = mongoose.model("products", productSchema);

module.exports = products;
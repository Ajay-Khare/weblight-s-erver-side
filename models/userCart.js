const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    product: { type: String, require: true },
    quantity: { type: Number, require: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
})

const cart = mongoose.model("cart", cartSchema);

module.exports = cart;
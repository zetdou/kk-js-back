const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: Number,
  variant: String,
  quantity: Number,
  image: String,
  category: String,
});

module.exports = mongoose.model("Product", ProductSchema);

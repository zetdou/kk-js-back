const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    description: String,
    price: Number,
    variant: String,
    quantity: Number,
    image: String,
    category: String,
  },
  { versionKey: false }
);

const Product = mongoose.model("Product", productSchema, "products");
module.exports = Product;

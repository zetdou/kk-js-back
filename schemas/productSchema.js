const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    variants: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    reviews: [
      {
        userId: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
      },
    ],
    quantity: { type: Number },
    image: { type: String },
    category: { type: String },
  },
  { versionKey: false }
);

const Product = mongoose.model("Product", productSchema, "products");
module.exports = Product;

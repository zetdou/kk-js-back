const Product = require("../schemas/productSchema");

const getAllProducts = async () => {
  return Product.find();
};

module.exports = { getAllProducts };

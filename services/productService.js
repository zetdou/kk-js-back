const Product = require("../schemas/ProductSchema");

const getAllProducts = async () => {
  return Product.find();
};

module.exports = { getAllProducts };

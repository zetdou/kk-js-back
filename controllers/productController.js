const { getAllProducts } = require("../services/productService");

const fetchAll = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

module.exports = { fetchAll };

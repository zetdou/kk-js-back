const express = require("express");
const router = express.Router();
const { fetchAll } = require("../controllers/productController");

router.get("/", fetchAll);

module.exports = router;

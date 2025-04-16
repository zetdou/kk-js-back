const express = require("express");
const cors = require("cors");
const path = require("path");

const productsRouter = require("./routes/products");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/products", productsRouter);

app.use((req, res) => {
  res.status(404).json({
    message: `Not found - ${req.path}`,
  });
});

module.exports = app;

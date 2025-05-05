const express = require("express");
const cors = require("cors");
const { jwtStrategy } = require("./config/jwt");
const path = require("path");

const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

jwtStrategy();

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/users", authRouter);
app.use("/products", productsRouter);

app.use((req, res) => {
  res.status(404).json({
    message: `Not found - ${req.path}`,
  });
});

module.exports = app;

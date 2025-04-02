const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productsRoutes = require("./routes/products");

require("dotenv").config();
const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DB_URL)
  .then((db) => {
    console.info("Db is connected");
    app.listen(port, () => {
      console.info(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

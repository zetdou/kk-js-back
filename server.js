const mongoose = require("mongoose");

require("dotenv").config();
const port = process.env.PORT;

const app = require("./app");

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

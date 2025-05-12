const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.resolve(
  __dirname,
  "firebase-service-account.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

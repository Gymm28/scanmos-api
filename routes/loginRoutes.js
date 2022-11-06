const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

router
  .route("/")
  .post(loginController.login);

router
  .route("/client")
  .post(loginController.clientLogin);

module.exports = router;

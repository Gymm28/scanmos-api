const express = require("express");
const router = express.Router();
const scanController = require("../controllers/scanController");

router
  .route("/")
  .post(scanController.scan);

module.exports = router;

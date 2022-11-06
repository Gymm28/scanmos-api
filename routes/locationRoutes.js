const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router
  .route("/")
  .get(locationController.getAllLocations)
  .post(locationController.createNewLocation);
//   .patch(clientController.updateUser)
//   .delete(clientController.deleteUser);

module.exports = router;

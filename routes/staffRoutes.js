const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");

router
  .route("/")
  .get(staffController.getAllStaff)
  .post(staffController.createNewStaff);
//   .patch(clientController.updateUser)
//   .delete(clientController.deleteUser);

module.exports = router;

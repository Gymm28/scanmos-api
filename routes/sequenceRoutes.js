const express = require("express");
const router = express.Router();
const sequenceController = require("../controllers/sequenceController");

router
  .route("/")
  .get(sequenceController.getAllSequences)
  .post(sequenceController.createNewSequence);
//   .patch(clientController.updateUser)
//   .delete(clientController.deleteUser);

module.exports = router;

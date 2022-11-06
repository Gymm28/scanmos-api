const Sequence = require("../models/Sequence");
const Location = require("../models/Location");
const asyncHandler = require("express-async-handler");

// @desc Handle scan
// @route POST /scan
// @access Private
const scan = asyncHandler(async (req, res) => {
  const { clientId, staffCardId, staffName, locationCardId, locationName, photo } = req.body;

  const location = await Location.findOne({ locationName }).lean().exec()

  // Confirm data
  if (!clientId || !staffCardId || !staffName || (!locationCardId && !photo)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let sequenceObject = {};
  if (!locationCardId) {
    if (!location) {
        return res.status(400).json({ message: "Invalid location" });
    }
    sequenceObject = { clientId, staffCardId, locationCardId: location.locationId, photo };
  } 
  else if (!photo) {
    sequenceObject = { clientId, staffCardId, locationCardId };
  }

  // Create and store new sequence
  const sequence = await Sequence.create(sequenceObject);

  if (sequence) {
    //created
    res.status(201).json({ message: `Received data from ${staffName}` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

module.exports = {
  scan,
};

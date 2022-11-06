const Staff = require("../models/Staff");
const Client = require("../models/Client");
const asyncHandler = require("express-async-handler");
// const bcrypt = require('bcrypt')
const { scryptSync, timingSafeEqual } = require("crypto");

// @desc Handle login
// @route POST /login
// @access Private
const login = asyncHandler(async (req, res) => {
  const { staffUsername, staffPassword } = req.body;

  // Confirm data
  if (!staffUsername || !staffPassword) {
    return res
      .status(400)
      .json({ message: "Both username and password are required" });
  }

  const staff = await Staff.findOne({ staffUsername }).exec();

  if (!staff) {
    return res.status(400).json({ message: 'Invalid credentials'})
  }
  console.log(`staff password (hashed) = ${staff.staffPassword}`);

  const [salt, key] = staff.staffPassword.split(":");
  const hashedBuffer = scryptSync(staffPassword, salt, 64);

  // timingSafeEqual prevents timing attack
  const keyBuffer = Buffer.from(key, "hex");
  const match = timingSafeEqual(hashedBuffer, keyBuffer);

  if (match) {
    res.status(201).json({ message: "Login successful", clientId: staff.clientId, staffCardId: staff.staffCardId, staffName: staff.staffName });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

// @desc Handle client login
// @route POST /clientLogin
// @access Private
const clientLogin = asyncHandler(async (req, res) => {
  const { companyName, companyPassword } = req.body;

  // Confirm data
  if (!companyName || !companyPassword) {
    return res
      .status(400)
      .json({ message: "Both username and password are required" });
  }

  const client = await Client.findOne({ companyName }).exec();

  if (!client) {
    return res.status(400).json({ message: 'Invalid credentials'})
  }
  console.log(`client password (hashed) = ${client.companyPassword}`);

  const [salt, key] = client.companyPassword.split(":");
  const hashedBuffer = scryptSync(companyPassword, salt, 64);

  // timingSafeEqual prevents timing attack
  const keyBuffer = Buffer.from(key, "hex");
  const match = timingSafeEqual(hashedBuffer, keyBuffer);

  if (match) {
    res.status(201).json({ message: "Login successful", companyName: client.companyName });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

module.exports = {
  login,
  clientLogin
};

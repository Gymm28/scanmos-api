const Client = require("../models/Client");
// const Note = require('../models/Note')
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { scryptSync, randomBytes } = require('crypto')

// @desc Get all clients
// @route GET /clients
// @access Private
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.find().lean();
  // make sure the client exist before check length
  if (!clients?.length) {
    return res.status(400).json({ message: "No clients found" });
  }
  res.json(clients);
});

// @desc Create new client
// @route POST /clients
// @access Private
const createNewClient = asyncHandler(async (req, res) => {
  const { companyName, companyPassword, clientLineToken, staffLineToken } =
    req.body;

  // Confirm data
  if (!companyName || !companyPassword || !clientLineToken || !staffLineToken) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate
  // async await promise use exec or something...
  const duplicate = await Client.findOne({ companyName }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate company" });
  }

  // generate a salt (just a random hex)
  const salt = randomBytes(16).toString("hex");

  // use scryptSync to hash it
  const hashedPassword = scryptSync(companyPassword, salt, 64).toString("hex");

  // store salt with hash in the db
  const clientObject = { companyName, companyPassword: `${salt}:${hashedPassword}`, clientLineToken, staffLineToken };

  // Create and store new client
  const client = await Client.create(clientObject);

  if (client) {
    //created
    res.status(201).json({ message: `New client ${companyName} created` });
  } else {
    res.status(400).json({ message: "Invalid client data received" });
  }
});

// // @desc Update a client
// // @route PATCH /clients
// // @access Private
// const updateclient = asyncHandler(async (req, res) => {
//     const { id, clientname, roles, active, password } = req.body

//     // Confirm data
//     if (!id || !clientname || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
//         return res.status(400).json({ message: 'All fields are required'})
//     }

//     const client = await client.findById(id).exec()

//     if (!client) {
//         return res.status(400).json({ message: 'client not found'})
//     }

//     // Check for duplicate
//     const duplicate = await client.findOne({ clientname }).lean().exec()
//     // Allow updates to the original client
//     if (duplicate && duplicate?._id.toString() !== id) {
//         return res.status(409).json({ message: 'Duplicate clientname'})
//     }

//     client.clientname = clientname
//     client.roles = roles
//     client.active = active

//     if (password) {
//         // Hash password
//         client.password = await bcrypt.hash(password, 10) // salt rounds
//     }

//     // not lean so it can save
//     const updatedclient = await client.save()

//     res.json({ message: `${updatedclient.clientname} updated` })
// })

// // @desc Delete a client
// // @route DELETE /clients
// // @access Private
// const deleteclient = asyncHandler(async (req, res) => {
//     const { id } = req.body

//     if (!id) {
//         return res.status(400).json({ message: 'client ID Required'})
//     }

//     const note = await Note.findOne({ client: id }).lean().exec()
//     if (note) {
//         return res.status(400).json({ message: 'client has assigned notes'})
//     }

//     const client = await client.findById(id).exec()

//     if (!client) {
//         return res.status(400).json({ message: 'client not found'})
//     }

//     const result = await client.deleteOne()

//     const reply = `clientname ${result.clientname} with ID ${result._id} deleted`

//     res.json(reply)
// })

module.exports = {
  getAllClients,
  createNewClient,
  // updateclient,
  // deleteclient
};

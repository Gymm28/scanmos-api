const Staff = require('../models/Staff')
// const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all staff
// @route GET /staff
// @access Private
const getAllStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.find().lean()
    // make sure the sequence exist before check length
    if (!staff?.length) {
        return res.status(400).json({ message: 'No staff found'})
    }
    res.json(staff)
})

// @desc Create new sequence
// @route POST /staff
// @access Private
const createNewStaff = asyncHandler(async (req, res) => {
    const { clientId, staffCardId, staffUsername, staffPassword, staffName, staffPhoto } = req.body

    // Confirm data
    if (!clientId || !staffCardId || !staffUsername || !staffPassword || !staffName || !staffPhoto) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    let staffObject = { clientId, staffCardId, staffUsername, staffPassword, staffName, staffPhoto };

    // Create and store new staff
    const staff = await Staff.create(staffObject)

    if (staff) { //created
        res.status(201).json({ message: `New staff ${staffName} created` })
    } else {
        res.status(400).json({ message: 'Invalid staff data received' })
    }
})

// // @desc Update a sequence
// // @route PATCH /staff
// // @access Private
// const updatesequence = asyncHandler(async (req, res) => {
//     const { id, sequencename, roles, active, password } = req.body

//     // Confirm data
//     if (!id || !sequencename || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
//         return res.status(400).json({ message: 'All fields are required'})
//     }

//     const sequence = await sequence.findById(id).exec()

//     if (!sequence) {
//         return res.status(400).json({ message: 'sequence not found'})
//     }

//     // Check for duplicate
//     const duplicate = await sequence.findOne({ sequencename }).lean().exec()
//     // Allow updates to the original sequence
//     if (duplicate && duplicate?._id.toString() !== id) {
//         return res.status(409).json({ message: 'Duplicate sequencename'})
//     }

//     sequence.sequencename = sequencename
//     sequence.roles = roles
//     sequence.active = active

//     if (password) {
//         // Hash password
//         sequence.password = await bcrypt.hash(password, 10) // salt rounds
//     }

//     // not lean so it can save
//     const updatedsequence = await sequence.save()

//     res.json({ message: `${updatedsequence.sequencename} updated` })
// })

// // @desc Delete a sequence
// // @route DELETE /staff
// // @access Private
// const deletesequence = asyncHandler(async (req, res) => {
//     const { id } = req.body

//     if (!id) {
//         return res.status(400).json({ message: 'sequence ID Required'})
//     }

//     const note = await Note.findOne({ sequence: id }).lean().exec()
//     if (note) {
//         return res.status(400).json({ message: 'sequence has assigned notes'})
//     }

//     const sequence = await sequence.findById(id).exec()

//     if (!sequence) {
//         return res.status(400).json({ message: 'sequence not found'})
//     }

//     const result = await sequence.deleteOne()

//     const reply = `sequencename ${result.sequencename} with ID ${result._id} deleted`

//     res.json(reply)
// })

module.exports = {
    getAllStaff,
    createNewStaff
    // updatesequence,
    // deletesequence
}

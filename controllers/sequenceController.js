const Sequence = require('../models/Sequence')
// const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all sequences
// @route GET /sequences
// @access Private
const getAllSequences = asyncHandler(async (req, res) => {
    const sequences = await Sequence.find().lean()
    // make sure the sequence exist before check length
    if (!sequences?.length) {
        return res.status(400).json({ message: 'No sequences found'})
    }
    res.json(sequences)
})

// @desc Create new sequence
// @route POST /sequences
// @access Private
const createNewSequence = asyncHandler(async (req, res) => {
    const { clientId, staffCardId, locationCardId, photo } = req.body

    // Confirm data
    if (!clientId || !staffCardId) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    let sequenceObject = { };
    if (!locationCardId && !photo) {
        sequenceObject = { clientId, staffCardId }
    }
    else if (!locationCardId) {
        sequenceObject = { clientId, staffCardId, photo }
    }
    else if (!photo) {
        sequenceObject = { clientId, staffCardId, locationCardId }
    }

    // Create and store new sequence
    const sequence = await Sequence.create(sequenceObject)

    if (sequence) { //created
        res.status(201).json({ message: `New sequence ${locationCardId} created` })
    } else {
        res.status(400).json({ message: 'Invalid sequence data received' })
    }
})

// // @desc Update a sequence
// // @route PATCH /sequences
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
// // @route DELETE /sequences
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
    getAllSequences,
    createNewSequence
    // updatesequence,
    // deletesequence
}

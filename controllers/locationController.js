const Location = require('../models/Location')
// const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all locations
// @route GET /locations
// @access Private
const getAllLocations = asyncHandler(async (req, res) => {
    const locations = await Location.find().lean()
    // make sure the location exist before check length
    if (!locations?.length) {
        return res.status(400).json({ message: 'No locations found'})
    }
    res.json(locations)
})

// @desc Create new location
// @route POST /locations
// @access Private
const createNewLocation = asyncHandler(async (req, res) => {
    const { clientId, locationId, locationName, alertHours } = req.body

    // Confirm data
    if (!clientId || !locationId || !locationName || !Array.isArray(alertHours) || !alertHours.length) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    // Check for duplicate
    // async await promise use exec or something...
    const duplicate = await Location.findOne({ locationId }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate location'})
    }

    const locationObject = { clientId, locationId, locationName, alertHours }

    // Create and store new location
    const location = await Location.create(locationObject)

    if (location) { //created
        res.status(201).json({ message: `New location ${locationName} created` })
    } else {
        res.status(400).json({ message: 'Invalid location data received' })
    }
})

// // @desc Update a location
// // @route PATCH /locations
// // @access Private
// const updatelocation = asyncHandler(async (req, res) => {
//     const { id, locationname, roles, active, password } = req.body

//     // Confirm data
//     if (!id || !locationname || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
//         return res.status(400).json({ message: 'All fields are required'})
//     }

//     const location = await location.findById(id).exec()

//     if (!location) {
//         return res.status(400).json({ message: 'location not found'})
//     }

//     // Check for duplicate
//     const duplicate = await location.findOne({ locationname }).lean().exec()
//     // Allow updates to the original location
//     if (duplicate && duplicate?._id.toString() !== id) {
//         return res.status(409).json({ message: 'Duplicate locationname'})
//     }

//     location.locationname = locationname
//     location.roles = roles
//     location.active = active

//     if (password) {
//         // Hash password
//         location.password = await bcrypt.hash(password, 10) // salt rounds
//     }

//     // not lean so it can save
//     const updatedlocation = await location.save()

//     res.json({ message: `${updatedlocation.locationname} updated` })
// })

// // @desc Delete a location
// // @route DELETE /locations
// // @access Private
// const deletelocation = asyncHandler(async (req, res) => {
//     const { id } = req.body

//     if (!id) {
//         return res.status(400).json({ message: 'location ID Required'})
//     }

//     const note = await Note.findOne({ location: id }).lean().exec()
//     if (note) {
//         return res.status(400).json({ message: 'location has assigned notes'})
//     }

//     const location = await location.findById(id).exec()

//     if (!location) {
//         return res.status(400).json({ message: 'location not found'})
//     }

//     const result = await location.deleteOne()

//     const reply = `locationname ${result.locationname} with ID ${result._id} deleted`

//     res.json(reply)
// })

module.exports = {
    getAllLocations,
    createNewLocation
    // updatelocation,
    // deletelocation
}

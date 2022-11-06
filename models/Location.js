const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    clientId: {
        type: String,
        required: true
    },
    locationId: {
        type: String,
        required: true
    },
    locationName: {
        type: String,
        required: true
    },
    alertHours: [{
        type: Number,
        default: 0
    }],
    active: {
        type: Boolean,
        default: true
    },
})

module.exports = mongoose.model('Location', locationSchema)
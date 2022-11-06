const mongoose = require('mongoose')

const staffSchema = new mongoose.Schema({
    clientId: {
        type: String,
        required: true
    },
    staffCardId: {
        type: String,
        required: true
    },
    staffUsername: {
        type: String,
        required: true
    },
    staffPassword: {
        type: String,
        required: true
    },
    staffName: {
        type: String,
        required: true
    },
    staffPhoto: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
})

module.exports = mongoose.model('Staff', staffSchema)
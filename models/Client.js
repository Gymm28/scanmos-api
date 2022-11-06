const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    companyPassword: {
        type: String,
        required: true
    },
    clientLineToken: {
        type: String,
        required: true
    },
    staffLineToken: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
})

module.exports = mongoose.model('Client', clientSchema)
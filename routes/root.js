const express = require('express')
const router = express.Router()
const path = require('path')

// ^ at the begining only, $ at the end only, .html is optional
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router
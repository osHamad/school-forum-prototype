const express = require('express')
const router = express.Router()

router.post('/new', async (req, res) => {
    res.redirect('/questions')
})

module.exports = router
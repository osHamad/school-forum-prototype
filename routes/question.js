const express = require('express')
const router = express.Router()

const questionModel = require('../models/question.model')

// GET requests
// get all questions
router.get('/', async (req, res)=>{
    const questions = await questionModel.find().sort({ createdAt: 'desc' })
    res.render('index', {questions:questions})
})

// get one specific question by id
router.get('/:id', async (req, res)=>{
    const question = await questionModel.findById(req.params.id)
    res.render('question', {question:question})
})

// POST requests
// create a new question
router.post('/new', (req, res)=>{
    const question = new questionModel (
        {
            title: req.body.title,
            details: req.body.details,
            category: req.body.category
        }
    )

    question.save((err)=>{
        if (err) {
            console.log(err)
            return res.status(500).render('errors/500')
        }
        res.send('new question added:'+req.body.title)
    })
})

// edit question
router.post('/:id/edit', (req, res)=>{

})

// delete question
router.post('/:id/delete', (req, res)=>{
    
})

module.exports = router
const express = require('express')
const router = express.Router()

const questionModel = require('../models/question.model')
const answerModel = require('../models/answer.model')

// POST requests
// answer a specific question
router.post('/:id', async (req, res)=>{
    let question = await questionModel.findById(req.params.id)
    const answer = new answerModel(
        {
            title: req.body.title
        }
    )
    question.answers.push(answer)
    question.save()
})

// edit an answer
router.post('/:id', async (req, res)=>{
    
})

// delete an answer
router.post('/:id', async (req, res)=>{
    
})

module.exports = router
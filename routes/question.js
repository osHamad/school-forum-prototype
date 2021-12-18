const express = require('express')
const router = express.Router()

const questionModel = require('../models/question.model')
const answerModel = require('../models/answer.model')

router.get('/', async (req, res)=>{
    const questions = await questionModel.find().sort({ createdAt: 'desc' })
    res.render('index', {questions:questions})
})

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

router.get('/:id', async (req, res)=>{
    const question = await questionModel.findById(req.params.id)
    res.render('question', {question:question})
})

router.post('/:id/answer', async (req, res)=>{
    let question = await questionModel.findById(req.params.id)
    const answer = new answerModel(
        {
            title: req.body.title
        }
    )
    question.answers.push(answer)
    question.save()
    res.send(question)
})

module.exports = router
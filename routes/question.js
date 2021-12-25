const express = require('express')
const router = express.Router()

const questionModel = require('../models/question.model')
const userModel = require('../models/user.model')
const answerModel = require('../models/answer.model')

const { isLoggedIn, belongsToOwner } = require('../helpers/middleware')

// GET requests
// get all questions
router.get('/', async (req, res) => {
    const questions = await questionModel.find().sort({ createdAt: 'desc' })
    res.render('index', {questions:questions})
})

// get one specific question by id
router.get('/:id', async (req, res) => {
    try {
        const question = await questionModel.findById(req.params.id)
        const answers = await answerModel.find().where('_id').in(question.questionBody.answers).exec()
        res.render('question', {question:question, answers:answers})
    } catch {
        res.send('404: page not found')
    }
})

// POST requests
// create a new question
router.post('/new', isLoggedIn, async (req, res) => {
    const user = await userModel.findById(req.session.userId)
    const question = new questionModel (
        {
            userInfo: 
            {
                userId: user._id,
    
                userName: user.userInfo.name,
    
                userGrade: user.userInfo.grade
            },
    
            questionBody: 
            {
                title: req.body.title,
    
                details: req.body.details,
    
                category: req.body.category
            },

            questionInfo: 
            {
                dateAsked: new Date()
            }
        }
    )

    question.save((err) => {
        if (err) {
            console.log(err)
            return res.status(500).render('errors/500')
        }
        user.userContent.questionsId.push(question._id)
        user.userStats.asked += 1
        user.save()
        res.redirect('/questions')
    })


})

// edit question
router.post('/:id/edit', isLoggedIn, (req, res) => {

})

// delete question
router.post('/:id/delete', isLoggedIn, belongsToOwner, async (req, res) => {
    await questionModel.findByIdAndDelete(req.params.id)
    res.send('deleted')
})

module.exports = router
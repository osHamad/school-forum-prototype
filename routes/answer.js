const express = require('express')
const router = express.Router()

const questionModel = require('../models/question.model')
const answerModel = require('../models/answer.model')
const userModel = require('../models/user.model')

const { isLoggedIn, questionBelongsToOwner } = require('../helpers/middleware')

router.get('/', async (req, res) => {
    const allanswer = await answerModel.find()
    res.send(allanswer)
})

// POST requests
// answer a specific question
router.post('/:id', isLoggedIn, async (req, res)=>{
    let question = await questionModel.findById(req.params.id)
    let user = await userModel.findById(req.session.userId)
    const answer = new answerModel(
        {
            userInfo: 
            {
                userId: user._id,
    
                userName: user.userInfo.name
            },
    
            answerBody:
            {
                details: req.body.details
            },
    
            answerInfo:
            {
                parentQuestion: req.params.id,
    
                dateAnswered: new Date()
            }
        }
    )
    answer.save()
    console.log(answer._id)
    question.questionBody.answers.push(answer._id)
    question.save()
    user.userContent.answersId.push(answer._id)
    user.userStats.points += 10
    user.userStats.answered += 1
    user.save()
    res.redirect('/questions/'+req.params.id)
})

// verify answer
router.post('/verify/:id', isLoggedIn, questionBelongsToOwner, async (req, res) => {
    const answer = await answerModel.findById(req.params.id)
    answer.answerInfo.isVerified = true
    answer.save()
})

// // edit an answer
// router.post('/:id', async (req, res)=>{
    
// })

// // delete an answer
// router.post('/:id', async (req, res)=>{
    
// })

module.exports = router
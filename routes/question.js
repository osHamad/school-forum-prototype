const express = require('express')
const router = express.Router()

const questionModel = require('../models/question.model')
const userModel = require('../models/user.model')
const answerModel = require('../models/answer.model')

const { isLoggedIn, questionBelongsToOwner } = require('../helpers/middleware')

// GET requests
// get all questions
router.get('/', async (req, res) => {
    const date = req.query.date == "Date" || req.query.date == undefined ? 'desc' : req.query.date
    const category = req.query.category == undefined ||  req.query.category == 'Category' ? undefined : { 'questionBody.category': req.query.category }
    const grade = req.query.grade == "Grade" ? undefined : { 'userInfo.userGrade': req.query.grade }
    const questions = await questionModel.find(category).sort({ 'questionInfo.dateAsked': date })
    let display
    if (req.session.userId) {
        const user = await userModel.findById(req.session.userId)
        display = {
            user: user.userInfo.name,
            login: 'Logout',
            loginAction: '/user/logout',
            loginMethod: 'post'
        }
    } else {
        display = {
            user: 'Not Logged In',
            login: 'Login',
            loginAction: '/user/login',
            loginMethod: 'get'
        }
    }
    res.render('index', {questions:questions, display:display})
})

// get one specific question by id
router.get('/:id', async (req, res) => {
    let display
    if (req.session.userId) {
        const user = await userModel.findById(req.session.userId)
        display = {
            user: user.userInfo.name,
            login: 'Logout',
            loginAction: '/user/logout',
            loginMethod: 'post'
        }
    } else {
        display = {
            user: 'Not Logged In',
            login: 'Login',
            loginAction: '/user/login',
            loginMethod: 'get'
        }
    }
    try {
        const question = await questionModel.findById(req.params.id)
        const answers = await answerModel.find().sort({'answerInfo.isVerified': 'desc'}).where('_id').in(question.questionBody.answers).exec()
        res.render('question', {question:question, answers:answers, display:display})
    } catch {
        res.render('errors/404')
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
        user.userStats.points += 5
        user.userStats.asked += 1
        user.save()
        res.redirect('/questions')
    })


})

// edit question
router.post('/:id/edit', isLoggedIn, (req, res) => {

})

// delete question
router.post('/:id/delete', isLoggedIn, questionBelongsToOwner, async (req, res) => {
    await questionModel.findByIdAndDelete(req.params.id)
    res.send('deleted')
})

module.exports = router
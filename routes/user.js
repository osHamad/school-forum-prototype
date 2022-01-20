// require dependencies
const express = require('express')
const bcrypt = require('bcrypt')

// require mongoose schema models
const userModel = require('../models/user.model')
const questionModel = require('../models/question.model')
const answerModel = require('../models/answer.model')

// require middleware
const { isLoggedIn, isLoggedOut } = require('../helpers/middleware')

// create router
const router = express.Router()

// GET requests
router.get('/edit', isLoggedIn, async (req, res) => {
    const user = await userModel.findById(req.session.userId)
    display = {
        user: user.userInfo.name,
        login: 'Logout',
        loginAction: '/user/logout',
        loginMethod: 'post'
    }
    
    userInfo = {
        name: user.userInfo.name.split(/(\s+)/),
        grade: user.userInfo.grade,
        email: user.userInfo.email.split('@')
    }
    res.render('editProfile', {display:display, userInfo:userInfo})
})

// get user login/register page
router.get('/login', isLoggedOut, (req, res) => {
    res.render('login', {error:{message:''}})
})

// get all users
router.get('/leaderboard', async (req, res) => {
    const users = await userModel.find().sort({'userStats.points': 'desc'})
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
    res.render('leaderboard', {display:display, users:users})
})

// view specific user profile
router.get('/profile/:user', async (req, res) => {
    user = await userModel.findById(req.params.user)
    if (!user) return res.render('errors/404')
    const info = {
        name:user.userInfo.name,
        grade:user.userInfo.grade,
        dateJoined:user.userInfo.dateCreated,
    }
    const stats = {
        points:user.userStats.points,
        asked:user.userStats.asked,
        answered:user.userStats.answered,
        verified:user.userStats.verified
    }
    const qna = {
        questions: await questionModel.find().sort({ 'questionInfo.dateAsked': 'desc' }).where('_id').in(user.userContent.questionsId).exec(),
        answers: await answerModel.find().where('_id').in(user.userContent.answersId).exec()
    }
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
    res.render('profile', {info:info, stats:stats, display:display, qna:qna})
})
// view specific user profile
router.get('/profile', isLoggedIn, async (req, res) => {
    user = await userModel.findById(req.session.userId)
    const display = {
        user: user.userInfo.name,
        login: 'Logout',
        loginAction: '/user/logout',
        loginMethod: 'post'
    }
    const info = {
        name:user.userInfo.name,
        grade:user.userInfo.grade,
        dateJoined:user.userInfo.dateCreated,
    }
    const stats = {
        points:user.userStats.points,
        asked:user.userStats.asked,
        answered:user.userStats.answered,
        verified:user.userStats.verified
    }
    const qna = {
        questions: await questionModel.find().sort({ 'questionInfo.dateAsked': 'desc' }).where('_id').in(user.userContent.questionsId).exec(),
        answers: await answerModel.find().where('_id').in(user.userContent.answersId).exec()
    }
    res.render('profile', {info:info, stats:stats, display:display, qna:qna})
    
})

//POST requests
// create a user
router.post('/register', async (req, res) => {
    try {
        if (req.body.password != req.body.passwordRe) return res.render('login', {error:{message:'Passwords do not match'}})
        if (await userModel.findOne({'userInfo.email': req.body.email + '@stu.ocsb.ca'})) return res.render('login', {error:{message:'Email already registered'}})
        const user = new userModel (
            {
                userInfo:
                {
                    name: req.body.firstName + ' ' + req.body.lastName,
        
                    email: req.body.email + '@stu.ocsb.ca',
        
                    password: await bcrypt.hash(req.body.password, 10),
        
                    grade: req.body.grade,

                    dateCreated: new Date()
                }
            }
        )

        user.save((e) => {
            if (e) {
                console.log(e)
                return res.status(500).render('errors/500')
            }
            res.render('login', {error:{message:''}})
        })

    } catch (e) {
        console.log(e)
        res.status(500).render('errors/500')
    }
})

// sign in
router.post('/login', isLoggedOut, (req, res) => {
    const userEmail = req.body.email
    const userPassword = req.body.password

    userModel.findOne (
        { "userInfo.email": userEmail },
        async (err, user) => {
            if (err) return res.status(500).render('errors/500')
            if (user === null) return res.render('login', { error: { message: 'email not registered' } })
            if (await bcrypt.compare(userPassword, user.userInfo.password)) {
                req.session.userId = user._id
                res.redirect('/questions')
            } else {
                return res.render('login', { error: { message: 'incorrect password' } })
            }
        }
    )
})

// logout of user
router.post('/logout', (req, res) => {
    req.session.destroy
    res.clearCookie('auth')
    res.redirect('/')
})



// delete user
router.post('/delete', isLoggedIn, async (req, res) => {
    await userModel.findByIdAndRemove(req.session.userId)
    req.session.destroy
    res.clearCookie('auth')
    res.redirect('/')
})

// edit user information
router.post('/edit', isLoggedIn, async (req, res) => {
    const user = await userModel.findById(req.session.userId)
    user.userInfo.name = req.body.firstName + ' ' + req.body.lastName
    user.userInfo.email = req.body.email + '@stu.ocsb.ca'
    user.userInfo.grade = req.body.grade
    user.save()
    res.redirect('/user/profile')
})

module.exports = router
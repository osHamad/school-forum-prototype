// require dependencies
const express = require('express')
const bcrypt = require('bcrypt')

// require mongoose schema models
const userModel = require('../models/user.model')

// require middleware
const { isLoggedIn } = require('../helpers/middleware')

// create router
const router = express.Router()

// GET requests
// get user login/register page
router.get('/login', (req, res) => {
    res.render('login', {error:{message:''}})
})

// get all users
router.get('/leaderboard', async (req, res) => {
    const allUsers = await userModel.find()
    res.send(allUsers)
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
    res.render('profile', {info:info, stats:stats})
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
    res.render('profile', {info:info, stats:stats, display:display})
})

//POST requests
// create a user
router.post('/register', async (req, res) => {
    try {
        const securedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new userModel (
            {
                userInfo:
                {
                    name: req.body.name,
        
                    email: req.body.email,
        
                    password: securedPassword,
        
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
            res.send('new user added:'+req.body.email)
        })

    } catch (e) {
        console.log(e)
        res.status(500).render('errors/500')
    }
})

// sign in
router.post('/login', (req, res) => {
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
    await userModel.findByIdAndDelete(req.session.userId)
    req.session.destroy
    res.clearCookie('auth')
    res.redirect('/')
})

// edit user information

module.exports = router
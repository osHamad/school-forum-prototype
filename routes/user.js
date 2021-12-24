// require dependencies
const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')

// require mongoose schema models
const userModel = require('../models/user.model')

// require middleware
const { isLoggedIn } = require('../helpers/middleware')

// create router
const router = express.Router()

// configure environment variables
require('dotenv').config()
const SESSION_SECRET = process.env.SESSION_SECRET

// initialize session for user
router.use(session(
    {
        name: 'auth',
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: 
        {
            // specify cookie options
        }
    }
))

// GET requests
// get user login/register page
router.get('/login', (req, res) => {
    res.render('login')
})

// get all users
router.get('/', async (req, res) => {
    const allUsers = await userModel.find()
    res.send(allUsers)
})

// view specific user profile
router.get('/profile/:user', async (req, res) => {
    user = await userModel.findById(req.params.user)
    if (!user) return res.send('user does not exist')
    res.json(user)
})

// view specific user profile
router.get('/profile', isLoggedIn, async (req, res) => {
    user = await userModel.findById(req.session.userId)
    res.json(user)
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
    if (!userEmail) return res.send('please enter email')
    if (!userPassword) return res.send('please enter password')

    userModel.findOne (
        { "userInfo.email": userEmail },
        async (err, user) => {
            if (err) return res.status(500).render('errors/500')
            if (user === null) return res.send('email not registered')
            if (await bcrypt.compare(userPassword, user.userInfo.password)) {
                req.session.userId = user._id
                res.redirect('/')
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
router.post('/delete', isLoggedIn, (req, res) => {
    userModel.findByIdAndDelete(req.session.userId)
    req.session.destroy
    res.clearCookie('auth')
    res.redirect('/')
})

// edit user information

module.exports = router
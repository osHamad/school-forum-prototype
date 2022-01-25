// require dependencies
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')

// require routes for making requests
const questionRouter = require('./routes/question')
const answerRouter = require('./routes/answer')
const userRouter = require('./routes/user')
const issuesRouter = require('./routes/issues')

// configure env file
require('dotenv').config()

// setup env variables
const PORT = process.env.PORT
const URI = process.env.URI
const SESSION_SECRET = process.env.SESSION_SECRET

// create app
const app = express()

// initialize session for user
app.use(session(
    {
        name: 'auth',
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: 
        {
            // specify cookie options
            maxAge: 1000 * 60 * 60 * 4  // set to 4 hours
        }
    }
))

// setup ejs view engine
app.set('view engine', 'ejs')
app.set('views', __dirname+'/views')

// setup static folder for css and enable parsers
app.use(express.static(__dirname + '/static'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))

// use routes to make requests
app.use('/questions', questionRouter)
app.use('/answer', answerRouter)
app.use('/user', userRouter)
app.use('/issues', issuesRouter)

// request for homepage
app.get('/', async (req, res) => {
    res.redirect('/questions')
})

// request for any page that does not exist (404 error)
app.get('*', async (req, res) => {
    res.render('errors/404')
})

// connect to db
mongoose.connect(URI, (e) => {
    // return if there is error
    if (e) return console.log(e)

    // listen on port
    console.log('connected to db')
    app.listen(PORT, () => {
        console.log('listening on port', PORT)
    })
})
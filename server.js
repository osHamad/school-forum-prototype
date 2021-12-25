// require dependencies
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')

// require routes for making requests
const questionRouter = require('./routes/question')
const answerRouter = require('./routes/answer')
const userRouter = require('./routes/user')

// configure env and setup env variables
require('dotenv').config()
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
        }
    }
))

// setup view engine
app.set('view engine', 'ejs')
app.set('views', __dirname+'/views')

// application usages
app.use(express.static(__dirname + '/static'))      // allow static files for views
app.use(express.json())     // middleware to parse json
app.use(express.urlencoded({extended: true}))

// use routes to make requests
app.use('/questions', questionRouter)
app.use('/answer', answerRouter)
app.use('/user', userRouter)

// request for homepage
app.get('/', async (req, res)=>{
    res.redirect('/questions')
})

// request for any page that does not exist (404 error)
app.get('*', async (req, res)=>{
    res.send('page does not exist')
})

// connect to db then listen on port
mongoose.connect(URI)
    .then(()=>{
        console.log('connected to db')
        // listen to port
        app.listen(PORT, ()=>{
            console.log('listening on port', PORT)
        })
    })
    .catch((e)=>{
        console.log('error occured:', e)
    })
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const questionModel = require('./models/question.model')
const questionRouter = require('./routes/question')

require('dotenv').config()
const PORT = process.env.PORT
const URI = process.env.URI

app.set('view engine', 'ejs')
app.set('views', __dirname+'/views')
app.use(express.static(__dirname + '/static'))
app.use(express.json())
app.use('/questions', questionRouter)

app.get('/', async (req, res)=>{
    res.send('this is the main page')
})

mongoose.connect(URI, (err)=>{
    if (err){
        console.log('error occured:', err)
        return
    }
    console.log('connected to db')
    app.listen(PORT, ()=>{
        console.log('listening on port', PORT)
    })
})
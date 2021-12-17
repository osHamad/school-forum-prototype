const express = require('express')
const app = express()
const mongoose = require('mongoose')
const questionModel = require('./models/question.model')

const PORT = 5000
const URI = 'mongodb+srv://testing-osama-tutorial:passwordforme@cluster0.56una.mongodb.net/commtech-rst?retryWrites=true&w=majority'

app.set('view engine', 'ejs')
app.set('views', __dirname+'/views')
app.use(express.static(__dirname + '/static'))
app.use(express.json())

app.get('/', (req, res)=>{
    res.render('index')
})

app.post('/new', (req, res)=>{
    console.log(req.body)
    const question = new questionModel (
        {
            title: req.body.title
        }
    )

    // save link to database
    question.save((err)=>{
        if (err) return console.log('500 error:', err)
        res.send('new question added:'+req.body.title)
    })
})

app.get('/questions', async (req, res)=>{
    question = await questionModel.find()
    res.send(question)
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
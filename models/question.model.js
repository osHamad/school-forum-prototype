const mongoose = require('mongoose')
const schema = mongoose.Schema
const tagModel = require('./tag.model').schema
const answerModel = require('./answer.model').schema

const questionSchema = new schema ({
    title: 
    {
        type: String, 
        required: true
    },
    details:
    {
        type: String,
        required: true
    },
    category:
    {
        type: String,
        required: true
    },
    tags:
    {
        type: [tagModel]
    },
    answers:
    {
        type: [answerModel]
    }
})

const questionModel = mongoose.model('questionModel', questionSchema)
module.exports = questionModel
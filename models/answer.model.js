const mongoose = require('mongoose')
const schema = mongoose.Schema

const answerSchema = new schema (
    {
        title: 
        {
            type: String,
            required: true
        }
    }
)

const answerModel = mongoose.model('answerModel', answerSchema)
module.exports = answerModel
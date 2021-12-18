const mongoose = require('mongoose')
const schema = mongoose.Schema

const tagScema = new schema (
    {
        name: 
        {
            type: String,
            required: true
        },
        color:
        {
            type: Number,
            required: true
        }
    }
)

const tagModel = mongoose.model('tagModel', tagScema)
module.exports = tagModel
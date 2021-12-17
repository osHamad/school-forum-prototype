const mongoose = require('mongoose')
const schema = mongoose.Schema

const questionSchema = new schema (
    {
        title: {type: String, required: true}
    }
)

const questionModel = mongoose.model('questionModel', questionSchema)
module.exports = questionModel
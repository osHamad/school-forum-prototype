const mongoose = require('mongoose')
const schema = mongoose.Schema

const answerSchema = new schema (
    {
        // information about the user who answered
        userInfo: 
        {
            userId:
            {
                type: String,
                required: true
            },

            userName:
            {
                type: String,
                required: true
            }
        },

        // the content of the answer
        answerBody:
        {
            details:
            {
                type: String,
                required: true
            }
        },

        // additional information about the answer
        answerInfo:
        {
            parentQuestion:
            {
                type: String,
                required: true
            },

            isVerified:
            {
                type: Boolean,
                default: false
            },

            dateAnswered:
            {
                type: Date,
                required: true
            }
        }
    }
)

const answerModel = mongoose.model('answerModel', answerSchema)
module.exports = answerModel
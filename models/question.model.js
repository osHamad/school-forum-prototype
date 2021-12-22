const mongoose = require('mongoose')
const schema = mongoose.Schema

const questionSchema = new schema (
    {
        // information about the user who asked
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
            },

            userGrade: 
            {
                type: Number,
                required: true
            }
        },

        // structure of the question
        questionBody: 
        {
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

            answers: 
            {
                type: [String],
                default: []
            }
        },

        // additional information about the question
        questionInfo: 
        {
            hasVerified: 
            {
                type: Boolean,
                default: false
            },

            answerNumber: 
            {
                type: Number,
                default: 0
            },

            dateAsked: 
            {
                type: Date,
                required: true
            }
        }
    }
)

const questionModel = mongoose.model('questionModel', questionSchema)
module.exports = questionModel
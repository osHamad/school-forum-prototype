const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema (
    {
        // basic user information
        userInfo:
        {
            name:
            {
                type: String,
                required: true
            },

            email:
            {
                type: String,
                required: true
            },

            password:
            {
                type: String,
                required: true
            },

            grade:
            {
                type: Number,
                required:true
            },

            role:
            {
                type: String,
                default: 'user'
            }
        },

        // user questions and answers
        userContent:
        {
            questionsId:
            {
                type: [String],
                default: []
            },

            answersId:
            {
                type: [String],
                default: []
            }
        },

        // user activity and points system
        userStats:
        {
            points:
            {
                type: Number,
                default: 0
            },

            asked:
            {
                type: Number,
                default: 0
            },

            answered:
            {
                type: Number,
                default: 0
            },

            verified:
            {
                type: Number,
                default: 0
            }
        }
    }
)

const userModel = mongoose.model('userModel', userSchema)
module.exports = userModel
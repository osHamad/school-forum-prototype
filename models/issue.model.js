const mongoose = require('mongoose')
const schema = mongoose.Schema

const issueSchema = new schema (
    {
        issueBody: 
        {
            details:
            {
                type: String,
                required: true
            },

            dateCreated:
            {
                type: Date,
                required: true
            }
        }
    }
)

const issueModel = mongoose.model('issueModel', issueSchema)
module.exports = issueModel
const express = require('express')
const router = express.Router()

const issueModel = require('../models/issue.model')
const userModel = require('../models/user.model')
const { isLoggedIn, isAdmin } = require('../helpers/middleware')

router.post('/new', (req, res) => {
    const issue = new issueModel (
        {
            issueBody:
            {
                details: req.body.details,
                dateCreated: new Date()
            }
        }
    )

    issue.save()
    res.redirect('/questions')
})

router.get('/', isLoggedIn, isAdmin, async (req, res) => {
    issues = await issueModel.find()
    const user = await userModel.findById(req.session.userId)
    display = {
        user: user.userInfo.name,
        login: 'Logout',
        loginAction: '/user/logout',
        loginMethod: 'post'
    }
    res.render('issues', {issues:issues, display:display})
})

module.exports = router
const questionModel = require('../models/question.model')
const answerModel = require('../models/answer.model')
const userModel = require('../models/user.model')

module.exports = {

    // check if user is logged in
    // else redirect them to login page
    isLoggedIn: (req, res, next) => {
        if (!req.session.userId) return res.redirect('/user/login')
        next()
    },

    questionBelongsToOwner: async (req, res, next) => {
        const answer = await answerModel.findById(req.params.id)
        const question = await questionModel.findById(answer.answerInfo.parentQuestion)
        if (req.session.userId != question.userInfo.userId) return res.render('errors/401')
        next()
    },

    isLoggedOut: (req, res, next) => {
        if (req.session.userId) return res.redirect('/questions')
        next()
    },

    isAdmin: async (req, res, next) => {
        const user = await userModel.findById(req.session.userId)
        if (user.userInfo.role != 'admin') return res.render('errors/401')
        next()
    }
}

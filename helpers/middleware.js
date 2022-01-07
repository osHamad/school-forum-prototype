const questionModel = require('../models/question.model')

module.exports = {

    // check if user is logged in
    // else redirect them to login page
    isLoggedIn: (req, res, next) => {
        if (!req.session.userId) return res.redirect('/user/login')
        next()
    },

    belongsToOwner: async (req, res, next) => {
        const question = await questionModel.findById(req.params.id)
        if (req.session.userId != question.userInfo.userId) return res.render('401: no access')
        next()
    }
}

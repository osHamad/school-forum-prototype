module.exports = {

    // check if user is logged in
    // else redirect them to login page
    isLoggedIn: (req, res, next) => {
        if (!req.session.userId) return res.redirect('login')
        next()
    }
}

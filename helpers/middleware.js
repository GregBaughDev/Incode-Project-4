const redirectToLogin = (req, res, next) => {
    !req.session.userID ? res.clearCookie('mrCoffeeEmployees') && res.redirect('/login') : next()
}

// redirect to homepage if user is logged in
const redirectToHome = (req, res, next) => {
    req.session.userID ? res.redirect('/') : next() 
}

module.exports = { redirectToLogin, redirectToHome }
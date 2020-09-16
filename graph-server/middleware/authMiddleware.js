function isAuth(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.send('ur not authenticated')
}

function isNotAuth(req, res, next) {
    if(req.isAuthenticated()){

        res.send('ur authenticated')
    }

    next()
}

function hi(req, res, next) {
    console.log('hi')
    next()
}

module.exports = { isAuth, isNotAuth, hi }
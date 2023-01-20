function staticPath(path) {
    return function (req, res, next) {
        req.body.staticPath = path;
        next();
    }
}

module.exports = staticPath
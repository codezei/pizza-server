function filePath(path) {
    return function (req, res, next) {

        req.body.filePath = path;
        next();
    }
}

module.exports = filePath
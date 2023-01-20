const jwt = require('jsonwebtoken')
const config = require('config')


module.exports = (req, res, next)=>{
    if (req.method === "OPTIONS") {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token || token === 'null') {
            req.body.user = {id: null}
            next()
            return
        }
        const decoded = jwt.verify(token, config.get('secretKey'))
        req.body.user = decoded
        next()
    } catch (e) {
        return res.status(401).json({message: "Order error"})
    }

}
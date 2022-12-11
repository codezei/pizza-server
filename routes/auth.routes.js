const Router = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth.middleware')
const router = new Router()
const config = require('config')


router.post('/registration', [
    check('email', 'Uncorrect email').isEmail(),
    check('password', 'Password must be longer than 3 and shorter than 12').isLength({min: 3, max: 12})
], async function (req, res) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Uncorrect request', errors})
        }
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        
        if (candidate) {
            return res.status(400).json({message: `User with email ${email} is already exist`})
        }
        let hashPassword = await bcrypt.hash(password, 10)
        const user = new User({email: email, password: hashPassword, admin: false})
        await user.save()
        return res.json({message: 'User was created'})
    } catch (e) {
        res.status(400).json({message: 'Server error'})
    }
})

router.post('/login', async function (req, res) {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            res.status(400).json({message: "User not faund"})
        }

        let isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            res.status(400).json({message: "Password invalid"})
        }
        const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: '1h'})


        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                admin: user.admin,
                name: user.name || "",
                phone: user.phone || "",
                date: user.date || ""
            }
        })

    } catch (e) {
        res.status(400).json({message: 'Server error'})
    }
})

router.post('/edit', authMiddleware , async function (req, res) {
    try {
        const user = await User.findOne({_id: req.user.id})
        const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: '1h'})
        const userData = req.body
        user.name = userData.name || ''
        user.phone = userData.phone || ''
        user.email = userData.email || ''
        user.date = userData.date || ''
        console.log(user)
        await user.save()
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                admin: user.admin,
                name: user.name,
                phone: user.phone,
                date: user.date
            }
        })
    } catch (e) {
        res.status(400).json({message: 'Server edit error'})
    }
})

router.get('/auth', authMiddleware, async function(req, res) {
    try {
        const user = await User.findOne({_id: req.user.id})
        const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: '1h'})
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                admin: user.admin,
                name: user.name || "",
                phone: user.phone || "",
                date: user.date || ""
            }
        })

    } catch (e) {
        res.send({message: 'Server error'})
    }
})



module.exports = router
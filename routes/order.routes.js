const Router = require('express')
const router = new Router()
const User = require('../models/User')
const Order = require('../models/Order')
const OrderNumber = require('../models/OrderNumber')
const orderMiddleware = require('../middleware/order.middleware')
const authMiddleware = require('../middleware/auth.middleware')



router.post('/add', orderMiddleware, async function (req, res) {
    try {   
        let currentUser
        if (req.body.user.id) {
            currentUser = await User.findOne({_id: req.body.user.id})
        }
        let orderCount = await OrderNumber.findOne()
        if (orderCount) {
            orderCount.order = orderCount.order + 1
            
        } else {
            let firstOrder = new OrderNumber()
            await firstOrder.save()
        }
        const {foods, user, total} = req.body
        let date = new Date()
        const order = new Order ({
            foods: JSON.parse(foods),
            user: {...JSON.parse(user)},
            userId: currentUser ? currentUser._id : null
        })
        order.data.date = Date.now()
        order.data.number = Number(`${date.getDate()}${date.getMonth()}${date.getFullYear()}${orderCount.order}`)
        order.data.total = JSON.parse(total)
        await orderCount.save()
        await order.save()
        return res.json(order)


    } catch (e) {
        return res.status(400).json({message: 'Order not added'})
    }   
})

router.post('/get', authMiddleware, async function (req, res) {
    try {   
        const orders = await Order.find({userId: req.body.user.id})
        return res.json(orders)
    } catch (e) {
        return res.status(400).json({message: 'Orders not get'})
    }   
})
router.post('/getAll', authMiddleware, async function (req, res) {
    try {   
        const user = await User.findOne({_id: req.body.user.id})
        if (user.admin) {
            const orders = await Order.find({})
            return res.json(orders)
        }

    } catch (e) {
        return res.status(400).json({message: 'Orders not get'})
    }   
})
router.post('/change', authMiddleware, async function (req, res) {
    try {   
        const user = await User.findOne({_id: req.body.user.id})
        if (user.admin) {
            const id = JSON.parse(req.body.id)
            const status = JSON.parse(req.body.status)
            const order = await Order.findOne({_id: id})
            order.data.status = status
            await order.save()
            return res.json(order)
        }

    } catch (e) {
        return res.status(400).json({message: 'Order status no change'})
    }   
})
router.get('/get', async function (req, res) {
    try {   
        const order = await Order.findById(req.query.id)
        return res.json(order)
    } catch (e) {
        return res.status(400).json({message: 'Order not get'})
    }   
})


module.exports = router
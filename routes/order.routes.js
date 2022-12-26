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
        if (req.user.id) {
            currentUser = await User.findOne({_id: req.user.id})
        }
        let orderCount = await OrderNumber.findOne()
        if (orderCount) {
            orderCount.order = orderCount.order + 1
            
        } else {
            let firstOrder = new OrderNumber()
            await firstOrder.save()
        }
        const {foods, user} = req.body
        let date = new Date()
        const order = new Order ({
            foods: JSON.parse(foods),
            user: {...JSON.parse(user), id: currentUser ? currentUser._id : null},
            number: Number(`${date.getDate()}${date.getMonth()}${date.getFullYear()}${orderCount.order}`)
        })
        order.data.date = Date.now()
        order.data.number = Number(`${date.getDate()}${date.getMonth()}${date.getFullYear()}${orderCount.order}`)
        await orderCount.save()
        await order.save()
        console.log(order)
        return res.json(order)


    } catch (e) {
        return res.status(400).json({message: 'Order not added'})
    }   
})

router.post('/get', authMiddleware, async function (req, res) {
    try {   

    } catch (e) {
        return res.status(400).json({message: 'Orders not get'})
    }   
})
router.get('/get', async function (req, res) {
    try {   
        const order = await Order.findById(req.query.id)
        return res.json(order)
    } catch (e) {
        return res.status(400).json({message: 'Product no found'})
    }   
})


module.exports = router
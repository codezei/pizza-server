const {Schema, model} = require('mongoose')

const OrderNumber = new Schema({
    order: {type: Number, default: 0},

})

module.exports = model('OrderNumber', OrderNumber)
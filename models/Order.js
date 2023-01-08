const {Schema, model, ObjectId} = require('mongoose')

const Order = new Schema({
    foods: {type: Array},
    user: {
        name: {type: String},
        phone: {type: String},
        email: {type: String},
        adress: {type: String},
        comment: {type: String},
    },
    data: {
        date: {type: Date, default: Date.now()},
        number: {type: Number},
        status: {type: String, default: 'processing'},
        total: {type: Number}
    },
    userId: {type: ObjectId, ref: "User"}

})

module.exports = model('Order', Order)
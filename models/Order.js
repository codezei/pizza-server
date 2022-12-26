const {Schema, model, ObjectId} = require('mongoose')

const Order = new Schema({
    foods: {type: Array},
    user: {
        name: {type: String},
        phone: {type: String},
        email: {type: String},
        adress: {type: String},
        comment: {type: String},
        id: {type: ObjectId, ref: "User"}
    },
    data: {
        date: {type: Date, default: Date.now()},
        number: {type: Number},
        status: {type: String, default: 'processing'}
    }

})

module.exports = model('Order', Order)
const {Schema, model} = require('mongoose')

const Product = new Schema({
    imgPath: {type: String},
    name: {type: String},
    composition: {type: Array},
    compositionAdd: {type: Array},
    price: {type: Number},
    date: {type: Date, default: Date.now()},
    weight: {type: Number, default: 400},
    cloudId: {type: String}
})

module.exports = model('Product', Product)
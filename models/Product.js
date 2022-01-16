const {Schema, model} = require('mongoose')

const Product = new Schema({
    imgPath: {type: String},
    name: {type: String},
    composition: {type: String},
    price: {type: Number},
    date: {type: Date, default: Date.now() }
})

module.exports = model('Product', Product)
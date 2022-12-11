const {Schema, model} = require('mongoose')

const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    admin: {type: Boolean},
    name: {type: String},
    phone: {type: String},
    date: {type: String}
})

module.exports = model('User', User)
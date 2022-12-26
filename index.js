const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const corsMiddleware = require('./middleware/cors.middleware')
const authRouter = require('./routes/auth.routes')
const productRouter = require('./routes/product.routes')
const orderRouter = require('./routes/order.routes')
const fileUpload = require('express-fileupload')
const filePathMiddleware = require('./middleware/filePath.middleware')
const staticPathMiddleware = require('./middleware/staticPath.middleware')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000
app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.json())
app.use(express.static(path.join(__dirname, 'static')))
app.use(filePathMiddleware(path.resolve(__dirname, 'files')))
app.use(staticPathMiddleware(path.resolve(__dirname, 'static')))

app.use('/api/auth', authRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)


function start () {
    try {

        mongoose.connect(config.get('dbUrl'))
        app.listen(PORT, function() {
            console.log(`Server started on port ${PORT}`)
        })
        

    } catch(e) {
        console.log(e)
    }
}

start ()



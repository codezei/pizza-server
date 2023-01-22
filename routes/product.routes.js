const Router = require('express')
const router = new Router()
const Product = require('../models/Product')
const User = require('../models/User')
const cloudinary = require('cloudinary')
const authMiddleware = require('../middleware/auth.middleware')
let streamifier = require('streamifier');


let uploadFromBuffer = (file) => {

    return new Promise((resolve, reject) => {
 
      let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
       {
         folder: "products"
       },
       (error, result) => {
 
         if (result) {
           resolve(result);
         } else {
           reject(error);
          }
        }
      );
 
      streamifier.createReadStream(file).pipe(cld_upload_stream);
    });
 
 };
 


router.post('/add', authMiddleware, async function (req, res) {
    try {   
        const user = await User.findOne({_id: req.user.id})
        if (!user.admin) return
        const {name, composition, price, compositionAdd} = req.body
        const file = req.files.file
        const product = new Product({})
        let resultAdd = await uploadFromBuffer(file.data);
        product.imgPath = resultAdd.url
        product.cloudId = resultAdd.public_id
        product.name = name
        product.composition = JSON.parse(composition)
        product.compositionAdd = JSON.parse(compositionAdd)
        product.price = price
        await product.save()
        return res.json(product)

    } catch (e) {
        return res.status(400).json({message: "Product not added"})
    }   
})

router.post('/edit', authMiddleware, async function (req, res) {
    try {   
        const user = await User.findOne({_id: req.user.id})
        if (!user.admin) return
        const currentProduct = await Product.findById(req.body.id) || null
        const {name, composition, price, compositionAdd} = req.body
        if (!!req.files) {
            const file = req.files.file
            let resultDelete = await cloudinary.v2.uploader.destroy(currentProduct.cloudId).then(result=>{
                return result
            });
            if (resultDelete.result === 'ok') {
                let resultEdit = await uploadFromBuffer(file.data);
                currentProduct.imgPath = resultEdit.url
                currentProduct.cloudId = resultEdit.public_id
            }

        }
        currentProduct.name = name
        currentProduct.composition = JSON.parse(composition)
        currentProduct.compositionAdd = JSON.parse(compositionAdd)
        currentProduct.price = price
        await currentProduct.save()
        return res.json(currentProduct)
    } catch (e) {
        return res.status(400).json({message: "Product not edit"})
    }   
})

router.get('/get', async function (req, res) {
    try {

        const products = await Product.find({})
        return res.json(products)

    } catch (e) {
        return res.status(400).json({message: "Product not get"})
    }
})

router.delete('/delete', authMiddleware, async function (req, res) {
    try {
        const user = await User.findOne({_id: req.user.id})
        if (!user.admin) {
            return res.status(400).json({message: "You do not have access"})
        }
        const product = await Product.findById(req.query.id)
        if (!product) {
            return res.status(400).json({message: "Product not found"})
        }
        let resultDelete = await cloudinary.v2.uploader.destroy(product.cloudId).then(result=>{
            return result
        })
        if (resultDelete.result === 'ok') {
            await product.remove()
        }
        return res.json({message: "Product was deleted"})
    } catch (e) {
        return res.json({message: "Delete product have error"})
    }
})

module.exports = router
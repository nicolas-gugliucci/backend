import {Router} from 'express'
import { uploader } from '../../utils.js'
import productManager from '../ProductManager.js'

const manager = new productManager()
const router = Router()

router.get('/', async (req,res)=>{
    let limit = req.query.limit
    const products = await manager.getProducts()
    if(!limit||isNaN(limit)) return res.send(products)
    let productsLimited = products.slice(0,Number(limit))
    res.send(productsLimited)
})

router.get('/:pid', async (req,res)=>{
    let id = req.params.pid
    let productRequested = await manager.getProductById(id)
    if(!productRequested||isNaN(id)) return res.status(404).send({
                                                status:"Error",
                                                error:"Not found",
                                                message:`There is no product with ID ${id}`
                                            })
    res.send(productRequested)
})

router.post('/', uploader.array('thumbnails'),async function(req,res){
    let product = req.body
    if(req.files){
        const thumbnails = req.files.map(file => file.path)
        product = {...product , thumbnails}
    }
    const error = await manager.addProduct(product)
    switch (error) {
        case -1:
            res.status(400).send({
                status:"Error",
                error:"Too many arguments",
                message:'Only one object is expected'
            })
            break;
        case -2:
            res.status(400).send({
                status:"Error",
                error:"Invalid structure",
                message:'Your product must have the following camps:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-Thumbnails <--(optional)'
            })
            break;
        case -3:
            res.status(411).send({
                status:"Error",
                error:"Invalid structure",
                message:'All parameters must include relevant information'
            })
            break;
        case -4:
            res.status(400).send({
                status:"Error",
                error:"Repeted code",
                message:`The code: ${product.code} has already been used`
            })
            break;
        case undefined:
            res.send({
                status:'Success',
                message:'Product added'
            })
            break;
        default:
            res.status(417).send({
                status:"Error",
                error:"Writting error",
                message: error
            })
            break;
    }
})

router.put('/:pid', async (req,res)=>{
    const id = req.params.pid
    const newData = req.body
    const error = await manager.updateProduct(id,newData)
    switch (error) {
        case -1:
            res.status(404).send({
                status:"Error",
                error:"Not found",
                message:`There is no product with ID ${id}`
            })
            break;
        case -2:
            res.status(400).send({
                status:"Error",
                error:"Invalid structure",
                message:'You are trying to change a property that is not included in following list:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-Thumbnails <--(optional)'
            })
            break;
        case -3:
            res.status(400).send({
                status:"Error",
                error:"Invalid structure",
                message:'All parameters must include relevant information'
            })
            break;
        case undefined:
            res.send({
                status:'Success',
                message:'Product updated'
            })
            break;
        default:
            res.status(417).send({
                status:"Error",
                error:"Writting error",
                message: error
            })
            break;
    }
})

router.delete('/:pid',async (req,res)=>{
    const id = req.params.pid
    const error = await manager.deleteProduct(id)
    switch (error) {
        case -1:
            res.status(404).send({
                status:"Error",
                error:"Not found",
                message:`There is no product with ID ${id}`
            })
            break;
        case undefined:
            res.send({
                status:'Success',
                message:'Product deleted'
            })
            break;
        default:
            res.status(417).send({
                status:"Error",
                error:"Writting error",
                message: error
            })
            break;
    }
})

export default router
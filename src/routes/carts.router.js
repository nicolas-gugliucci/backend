import {Router} from 'express'
import { uploader } from '../utils.js'
import CartManager from '../CartManager.js'

const manager = new CartManager()
const router = Router()

router.post('/', async (req,res)=>{
    const error = manager.newCart()
    if(error){
        res.status(417).send({
            status:"Error",
            error:"Writting error",
            message: error
        })
    }else{
        res.send({
            status:'Success',
            message:'Cart created'
        })
    }
})

router.get('/:cid', async (req,res)=>{
    let id = req.params.cid
    let productsInCart = await manager.getCartById(id)
    if(productsInCart===-1) return res.status(404).send({
                                        status:"Error",
                                        error:"Not found",
                                        message:`There is no product with ID ${id}`
                                    })
    res.send(productsInCart)
})

router.post(' /:cid/product/:pid', async (req,res)=>{
    let cid = req.params.cid
    let pid = req.params.pid
    const error = await manager.addProductToCart(cid,pid)
    switch (error) {
        case -1:
            res.status(404).send({
                status:"Error",
                error:"Not found",
                message:`There is no cart with ID ${cid}`
            })
            break;
        case -2:
            res.status(400).send({
                status:"Error",
                error:"Not found",
                message:`There is no product with ID ${id}`
            })
            break;
        case 1:
            res.send({
                status:'Success',
                message:'Product added to cart'
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
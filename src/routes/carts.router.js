import { Router } from 'express'
import CartManager from '../dao/dbManagers/carts.js'

const manager = new CartManager()
const router = Router()

router.get('/', async (req, res) => {
    const carts = await manager.getCarts()
    if (carts?.error) errors(res, carts, id)
    else res.send({
        status: 'success',
        payload: carts
    })
})

router.post('/', async (req, res) => {
    const result = await manager.newCart()
    if (result === 1) res.send({
        status: 'Success',
        message: 'Cart created'
    })
    else errors(res, result)
})

router.get('/:cid', async (req, res) => {
    const id = req.params.cid
    const productsInCart = await manager.getCartById(id)
    if (productsInCart === -1 || productsInCart?.error) errors(res, productsInCart, id)
    else res.send({
        status: 'success',
        payload: productsInCart.products
    })
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const result = await manager.addProductToCart(cid, pid)
    if (result === 1) res.send({
        status: 'Success',
        message: 'Product added to cart'
    })
    else errors(res, result, cid, pid)
})

const errors = (res, result, cid, pid) => {
    switch (res, result) {
        case -10:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `There is no cart with ID ${cid}`
            })
            break;
        case -4:
            res.status(400).send({
                status: "Error",
                error: "Not found",
                message: `There is no product with ID ${pid}`
            })
            break;
        default:
            const { error, message } = result
            res.status(400).send({
                status: "Error",
                error: error,
                message: message
            })
            break;
    }
}

export default router
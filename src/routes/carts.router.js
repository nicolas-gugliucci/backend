import { Router } from 'express'
import { uploader } from '../utils/utils.js'
import CartManager from '../dao/dbManagers/carts.js'
import { io } from '../utils/socket-io.js'

const manager = new CartManager()
const router = Router()

io

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
    if (result.error === 1) res.send({
        status: 'Success',
        message: 'Cart created',
        payload: result.result
    })
    else errors(res, result)
})

router.get('/:cid', async (req, res) => {
    const id = req.params.cid
    const productsInCart = await manager.getCartById(id, true)
    if (productsInCart === -10 || productsInCart?.error) errors(res, productsInCart, id)
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

router.delete('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const result = await manager.deleteProductFromCart(pid, cid)
    if (result === 1) res.send({
        status: 'Success',
        message: 'Product deleted from cart'
    })
    else errors(res, result, cid, pid)
})

router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid
    const result = await manager.deleteAllFromCart(cid)
    if (result === 1) res.send({
        status: 'Success',
        message: 'Cart emptied'
    })
    else errors(res, result, cid)
})

router.put('/:cid', uploader.array(), async (req, res) => {
    if (Object.keys(req.body).length === 0) return errors(res, -9)
    const newData = req.body
    const cid = req.params.cid
    const result = await manager.completeUpdate(cid, newData)
    if (result?.id) return errors(res, result.result, null, result.id)
    if (result === 1) res.send({
        status: 'Success',
        message: 'Cart updated'
    })
    else errors(res, result, cid)
})

router.put('/:cid/product/:pid', uploader.array(), async function (req, res) {
    const { quantity } = req.body
    if (Object.keys(req.body).length !== 1 || !quantity) return errors(res, -11)
    const cid = req.params.cid
    const pid = req.params.pid
    if (!quantity) return errors(res, -11)
    const result = await manager.updateQuantity(cid, pid, quantity)
    if (result === 1) res.send({
        status: 'Success',
        message: 'Product updated in cart'
    })
    else errors(res, result, cid, pid)
})

const errors = (res, result, cid, pid) => {
    switch (res, result) {
        case -15:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: `Make sure you have all the necessary camps in your request`
            })
            break;
        case -14:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `Cart ID or product ID is wrong`
            })
            break;
        case -13:
            res.status(400).send({
                status: "Error",
                error: "Unnecessary action",
                message: `The cart ${cid} was already empty`
            })
            break;
        case -12:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `There is no product with ID ${pid} in the cart ${cid}`
            })
            break;
        case -11:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: `You are trying to update an invalid property or one with an invalid value`
            })
            break;
        case -10:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `There is no cart with ID ${cid}`
            })
            break;
        case -9:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: 'You must update at least one property'
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
import CartService from '../services/cart.service.js'
import ProductService from '../services/product.service.js'
import TicketService from '../services/ticket.service.js'
import { errors } from '../utils/errors/errorResponse.js'

const service = new CartService()
const prod_serv = new ProductService()
const ticket_serv = new TicketService()

class cartController{
    async getAll (req, res) {
        const carts = await service.getCarts()
        if (carts?.error) errors(req, res, carts, null, id)
        else res.send({
            status: 'success',
            payload: carts
        })
    }

    async createCart (req, res) {
        const result = await service.newCart()
        if (result.error === 1) res.send({
            status: 'Success',
            message: 'Cart created',
            payload: result.result
        })
        else errors(req, res, result)
    }

    async getCart (req, res) {
        const id = req.params.cid
        const productsInCart = await service.getCartById(id, true)
        if (productsInCart === -10 || productsInCart?.error) errors(req, res, productsInCart, null, id)
        else res.send({
            status: 'success',
            payload: productsInCart.products
        })
    }

    async addToCart (req, res) {
        const cid = req.params.cid
        const pid = req.params.pid

        if (req.session?.user?.role==='premium' && req.session.user.email===(await prod_serv.getProductById(id)).owner) return errors(req, res, -19)
        
        const result = await service.addProductToCart(cid, pid)
        const cart = await service.getCartById(cid, true)
        if (result?.error === 1) res.send({
            status: 'Success',
            message: 'Product added to cart',
            payload: cart
        })
        else errors(req, res, result, pid, cid)
    }

    async deleteProduct (req, res) {
        const cid = req.params.cid
        const pid = req.params.pid
        const result = await service.deleteProductFromCart(pid, cid)
        if (result === 1) res.send({
            status: 'Success',
            message: 'Product deleted from cart'
        })
        else errors(req, res, result, pid, cid)
    }

    async deleteAll (req, res) {
        const cid = req.params.cid
        const result = await service.deleteAllFromCart(cid)
        if (result === 1) res.send({
            status: 'Success',
            message: 'Cart emptied'
        })
        else errors(req, res, result, null, cid)
    }

    async updateCart (req, res) {
        if (Object.keys(req.body).length === 0) return errors(res, -9)
        const newData = req.body
        const cid = req.params.cid
        const result = await service.completeUpdate(cid, newData)
        if (result?.id) return errors(res, result.result, null, result.id)
        if (result === 1) res.send({
            status: 'Success',
            message: 'Cart updated'
        })
        else errors(req, res, result, null, cid)
    }

    async updateProduct (req, res) {
        const { quantity } = req.body
        if (Object.keys(req.body).length !== 1 || !quantity) return errors(res, -11)
        const cid = req.params.cid
        const pid = req.params.pid
        if (!quantity || quantity <= 0) return errors(req, res, -11)
        const result = await service.updateQuantity(cid, pid, quantity)
        if (result === 1) res.send({
            status: 'Success',
            message: 'Product updated in cart'
        })
        else errors(res, result, pid, cid)
    }

    async purchase (req, res) {
        const cid = req.params.cid
        const products = (await service.getCartById(cid, true)).products
        let products_processed = []
        let products_not_processed = []
        let amount = 0
        for (const product of products) {
            const pid = product._id._id
            const stock = (await prod_serv.getProductById(pid)).stock
            const quantity = product.quantity
            if (stock >= quantity) {
                const result = await prod_serv.updateProduct(pid,{stock:stock-quantity})
                if (result !== 1) {
                    products_not_processed.push(pid)
                    errors(req, res, result, pid, cid)
                }
                products_processed.push(pid)
                amount += product._id.price*product.quantity
            }else{
                products_not_processed.push(pid)
            }
        }
        const purchaser = req?.session?.user?.email?req?.session?.user?.email:'gugliucci.nicolas@gmail.com'
        const ticket_result = await ticket_serv.generateTicket(amount, purchaser)
        for (const pid of products_processed) {
            const result = await service.deleteProductFromCart(pid,cid)
            if (result !== 1) {
                errors(req, res, result, pid, cid)
            }
        }
        console.log(ticket_result)
        if (ticket_result) res.send({
            status: 'Success',
            ticket: ticket_result.ticket,
            not_processed: products_not_processed
        })
    }
}

const controller = new cartController()
const { 
    getAll,
    createCart, 
    getCart, 
    addToCart, 
    deleteProduct, 
    deleteAll, 
    updateCart, 
    updateProduct,
    purchase
} = controller

export {
    getAll,
    createCart, 
    getCart, 
    addToCart, 
    deleteProduct, 
    deleteAll, 
    updateCart,
    updateProduct,
    purchase
}
import { MAIL, transport } from '../config/config.js'
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
        console.log(id)
        const productsInCart = await service.getCartById(id, true)
        console.log(productsInCart)
        if (productsInCart === -10 || productsInCart?.error) errors(req, res, productsInCart, null, id)
        else res.send({
            status: 'success',
            payload: productsInCart.products
        })
    }

    async addToCart (req, res) {
        const cid = req.params.cid
        const pid = req.params.pid

        if (req.session?.user?.role==='premium' && req.session.user.email===(await prod_serv.getProductById(pid)).owner) return errors(req, res, -19)
        
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

    async purchase(req, res) {
        const cid = req.params.cid;
        const products = (await service.getCartById(cid, true)).products;
        let products_processed = [];
        let products_not_processed = [];
        let amount = 0;
    
        for (const product of products) {
            const pid = product._id._id;
            const prod = await prod_serv.getProductById(pid);
            const stock = prod.stock;
            const title = prod.title;
            const quantity = product.quantity;
    
            if (stock >= quantity) {
                const result = await prod_serv.updateProduct(pid, { stock: stock - quantity });
    
                if (result !== 1) {
                    products_not_processed.push(pid);
                    errors(req, res, result, pid, cid);
                }
    
                products_processed.push({ pid, title, quantity });
                amount += product._id.price * product.quantity;
            } else {
                products_not_processed.push({ pid, title, quantity });
            }
        }
    
        const purchaser = req?.session?.user?.email ? req.session.user.email : 'nicogna9@gmail.com';
        const ticket_result = await ticket_serv.generateTicket(amount, purchaser);
    
        for (const product of products_processed) {
            const result = await service.deleteProductFromCart(product.pid, cid);
    
            if (result !== 1) {
                errors(req, res, result, product.pid, cid);
            }
        }
    
        console.log(ticket_result);
    
        if (ticket_result) {
            const productsHTML = products_processed.map(product => `<h4>${product.title} x${product.quantity}</h4>`).join('');
            const notProcessedHTML = products_not_processed.length > 0 ? `<p>Some items were not processed due to insufficient stock:</p>` : '';
            const notProcessedHTMLProducts = products_not_processed.length > 0 ? products_not_processed.map(product => `<p>${product.title} x${product.quantity}</p>`).join('') : '';
    
            const mailParams = {
                from: `${MAIL}`,
                to: `${purchaser}`,
                subject: 'Purchase',
                html:
                    `<div style="text-align: center;">
                        <h1>Purchase sum</h1>
                        ${productsHTML}
                        <h3>Total US$${ticket_result.ticket.amount}</h3>
                        ${notProcessedHTML}
                        ${notProcessedHTMLProducts}
                        <h2>Your order code: ${ticket_result.ticket.code}</h2>
                        <h4>Thank you!</h4>
                    </div>`,
            };
    
            const result = await transport.sendMail(mailParams);
            res.send({
                status: 'Success',
                ticket: ticket_result.ticket,
                not_processed: products_not_processed.map(product => product.pid),
            });
        }
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
import express from "express";
import productManager from '../dao/dbManagers/products.js'
import cartManager from '../dao/dbManagers/carts.js'

const manager = new productManager()
const cartsManager = new cartManager()
const router = express.Router()

router.get('/', async (req, res) => {
    const limit = req.query.limit
    const page = req.query.page
    const sort = req.query.sort
    const query = req.query.query
    const currentUrl = `http://localhost:8080${req.originalUrl}`
    let products = await manager.getProducts(limit, page, sort, query, currentUrl)
    res.render('home', {
        style: 'index.css',
        products: products.payload,
        prevLink: products.prevLink,
        nextLink: products.nextLink
    })
})

router.get('/realtimeproducts', async (req, res) => {
    const limit = req.query.limit
    const page = req.query.page
    const sort = req.query.sort
    const query = req.query.query
    const currentUrl = `http://localhost:8080${req.originalUrl}`
    let products = await manager.getProducts(limit, page, sort, query, currentUrl)
    res.render('realTimeProducts', {
        style: 'index.css',
        products: products.payload,
    })
})

router.get('/chat', (req, res) => {
    res.render('chat', {})
})

router.get('/products', async (req, res) => {
    const limit = req.query.limit
    const page = req.query.page
    const sort = req.query.sort
    const query = req.query.query
    const currentUrl = `http://localhost:8080${req.originalUrl}`
    let products = await manager.getProducts(limit, page, sort, query, currentUrl)
    res.render('products', {
        style: 'index.css',
        products: products.payload,
        prevLink: products.prevLink,
        nextLink: products.nextLink
    })
})

router.get('/carts/:cid', async (req, res) => {
    const id = req.params.cid
    const productsInCart = await cartsManager.getCartById(id, true)
    res.render('cart', {
        style: 'index.css',
        products: productsInCart.products
    })
})

export default router
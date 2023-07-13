import express from "express";
import productManager from '../dao/dbManagers/products.js'

const manager = new productManager()
const router = express.Router()

router.get('/', async (req, res) => {
    const products = await manager.getProducts()
    res.render('home', {
        style: 'index.css',
        products
    })
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await manager.getProducts()
    res.render('realTimeProducts', {
        style: 'index.css',
        products,
    })
})

router.get('/chat', (req, res) => {
    res.render('chat', {})
})

export default router
import express from "express";
import productManager from '../controllers/ProductManager.js'

const manager = new productManager()
const router = express.Router()

router.get('/', async (req, res) => {
    const products = await manager.getProducts()
    res.render('home',{
        style: 'index.css',
        products
    })
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await manager.getProducts()
    res.render('realTimeProducts',{
        style: 'index.css',
        products,
    })
})

export default router
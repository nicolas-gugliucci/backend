import productManager from './ProductManager.js'
import express from 'express'

const manager = new productManager()

const app = express()

app.get('/',(req,res)=>{
    res.send('<h1 style="color:fuchsia;">Bienvenido</h1>')
})

app.get('/products',async (req,res)=>{
    let limit = req.query.limit
    const products = await manager.getProducts()
    if(!limit||isNaN(limit)) return res.send(products)
    let productsLimited = products.slice(0,Number(limit))
    res.send(productsLimited)
})

app.get('/products/:pid', async (req,res)=>{
    let id = req.params.pid
    let productRequested = await manager.getProductById(id)
    if(!productRequested||isNaN(id)) return res.send({error: `There is no product with ID ${id}`})
    res.send(productRequested)
})

app.listen(8080,()=>console.log("Servidor arriba"))
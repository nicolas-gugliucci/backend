import express from 'express'
import userRouter from "./routes/products.router.js";
import petsRouter from "./routes/carts.router.js";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products', userRouter)
app.use('/api/carts', petsRouter)

const server = app.listen(8080,()=>console.log('Server arriba'))

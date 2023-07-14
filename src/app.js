import express from "express";
import handlebars from "express-handlebars"
import { __dirname } from "./utils/utils.js";
import viewRouter from "./routes/views.router.js"
import cartRouter from "./routes/carts.router.js";
import userRouter from "./routes/products.router.js"
import { socketConnection } from "./utils/socket-io.js";
import mongoose from 'mongoose'
import "dotenv/config"


const app = express()

const PORT = 8080

mongoose.set('strictQuery', false)

const conection = mongoose.connect(`${process.env.DATABASE_URL}`)

const httpserver = app.listen(PORT, () => console.log('Server arriba'))
socketConnection(httpserver)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + 'src/views')
app.set('view engine', 'handlebars')
app.use('/api/products', userRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewRouter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

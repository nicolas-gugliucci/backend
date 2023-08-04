import express from "express";
import handlebars from "express-handlebars"
import { __dirname } from "./utils/utils.js";
import viewRouter from "./routes/views.router.js"
import cartRouter from "./routes/carts.router.js";
import productRouter from "./routes/products.router.js"
import { socketConnection } from "./utils/socket-io.js";
import mongoose from 'mongoose'
import "dotenv/config"
import session from 'express-session'
import MongoStore from 'connect-mongo'
import sessionRouter from './routes/sessions.router.js'
import { initPassport, initializedPassport} from "./config/passport.config.js";
import passport from "passport";

const app = express()

const PORT = 8080

mongoose.set('strictQuery', false)

const conection = mongoose.connect(
    `${process.env.DATABASE_URL}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

app.use(session({
    store: MongoStore.create({
        mongoUrl: `${process.env.DATABASE_URL}`,
        mongoOptions:{ useNewUrlParser : true , useUnifiedTopology:true},
        ttl: 900
    }),
    secret:`${process.env.MONGO_STORE_SECRET}`,
    resave:false,
    saveUninitialized: false
}))

initializedPassport()
initPassport()
app.use(passport.initialize())
app.use(passport.session())

const httpserver = app.listen(PORT, () => console.log('Server arriba'))
socketConnection(httpserver)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + 'src/views')
app.set('view engine', 'handlebars')

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewRouter)
app.use('/api/sessions', sessionRouter)
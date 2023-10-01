import express from "express";
import handlebars from "express-handlebars"
import { __dirname } from "./utils/utils.js";
import viewRouter from "./routes/views.routes.js"
import cartRouter from "./routes/carts.routes.js";
import testRouter from "./routes/tests.routes.js";
import productRouter from "./routes/products.routes.js"
import { socketConnection } from "./utils/socket-io.js";
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import sessionRouter from './routes/sessions.routes.js'
import { initPassport } from "./middlewares/passport.config.js";
import passport from "passport";
import { DATABASE_URL, MONGO_STORE_SECRET, PORT_ENV } from "./config/config.js";
import cookieParser from "cookie-parser";
import errorMeddleware from './middlewares/errors.js'
import { addLogger } from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from 'swagger-ui-express'

const swaggerOptions={
    definition:{
        openapi: '3.0.0',
        info:{
            title:'CoderHouse final project',
            description:'A backend proyect performing an E-commerce',
            version: '1.0.0',
            contact:{
                name:'Nicolás Gugliucci',
                url:'http://www.linkedin.com/in/nicolás-gugliucci-nasta',
            }
        }
    },
    apis: [`${__dirname}/src/docs/**/*.yaml`]
}

const spec = swaggerJSDoc(swaggerOptions)

const app = express()

const PORT = PORT_ENV

mongoose.set('strictQuery', false)

const conection = mongoose.connect(
    `${DATABASE_URL}`,
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
        mongoUrl: `${DATABASE_URL}`,
        mongoOptions:{ useNewUrlParser : true , useUnifiedTopology:true},
        ttl: 900
    }),
    secret:`${MONGO_STORE_SECRET}`,
    resave:false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: false,
        secure: false 
    },
}))

app.use(cookieParser());
app.use(addLogger)

initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/apidocs',swaggerUIExpress.serve,swaggerUIExpress.setup(spec))

const httpserver = app.listen(PORT, () => console.log('Server arriba'))
socketConnection(httpserver)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + 'src/views')
app.set('view engine', 'handlebars')

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/test', testRouter)
app.use(errorMeddleware)


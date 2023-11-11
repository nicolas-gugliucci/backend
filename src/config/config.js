import dotenv from 'dotenv'
import params from './params.js'
import nodemailer from 'nodemailer'


const environment = params.mode;

// Railway proporciona automáticamente las variables de entorno
dotenv.config();

// Ahora, puedes acceder a las variables de entorno directamente
// sin depender de archivos .env específicos para cada entorno

// Ejemplo de cómo puedes usar la variable de entorno NODE_ENV
let PORT_ENV
let LOGGER_LEVEL
if (environment.toUpperCase() === 'DEVELOPMENT') {
    PORT_ENV = process.env.PORT_DEV
    LOGGER_LEVEL = process.env.LOGGER_LEVEL_DEV
} else {
    PORT_ENV = process.env.PORT_PROD
    LOGGER_LEVEL = process.env.LOGGER_LEVEL_PROD
}


// const environment = 'production'

// dotenv.config({
//     path: './.env'//'DEVELOPMENT'?'./.env.development':'./.env.production'
// })

// const environment = (params.mode)

// dotenv.config({
//     path: environment.toUpperCase()==='DEVELOPMENT'?'./.env.development':'./.env.production'
// })
const DATABASE_TEST_URL = process.env.DATABASE_TEST_URL
const DATABASE_URL = process.env.DATABASE_URL
const MONGO_STORE_SECRET = process.env.MONGO_STORE_SECRET
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const MAIL_PASSWORD = process.env.MAIL_PASSWORD
const MAIL = process.env.MAIL
const HOST = process.env.HOST

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: `${MAIL}`,
        pass: `${MAIL_PASSWORD}`
    }
})


export {DATABASE_URL, MONGO_STORE_SECRET, CLIENT_ID, CLIENT_SECRET, PORT_ENV, LOGGER_LEVEL, environment, transport, MAIL, DATABASE_TEST_URL, HOST}
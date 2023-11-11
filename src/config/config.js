import dotenv from 'dotenv'
import params from './params.js'
import nodemailer from 'nodemailer'

const environment = 'PRODUCTION'

dotenv.config({
    path: './.env'//'DEVELOPMENT'?'./.env.development':'./.env.production'
})
const DATABASE_TEST_URL = process.env.DATABASE_TEST_URL
const DATABASE_URL = process.env.DATABASE_URL
const MONGO_STORE_SECRET = process.env.MONGO_STORE_SECRET
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const PORT_ENV = process.env.PORT
const LOGGER_LEVEL = process.env.LOGGER_LEVEL
const MAIL_PASSWORD = process.env.MAIL_PASSWORD
const MAIL = process.env.MAIL

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: `${MAIL}`,
        pass: `${MAIL_PASSWORD}`
    }
})


export {DATABASE_URL, MONGO_STORE_SECRET, CLIENT_ID, CLIENT_SECRET, PORT_ENV, LOGGER_LEVEL, environment, transport, MAIL, DATABASE_TEST_URL}
import "dotenv/config"

const DATABASE_URL = process.env.DATABASE_URL
const MONGO_STORE_SECRET = process.env.MONGO_STORE_SECRET
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const MAIL_PASSWORD = process.env.MAIL_PASSWORD
const MAIL = process.env.MAIL
const MAIL_2 = process.env.MAIL_2

export {DATABASE_URL, MONGO_STORE_SECRET, CLIENT_ID, CLIENT_SECRET, MAIL_PASSWORD, MAIL, MAIL_2}
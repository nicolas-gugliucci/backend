import { fileURLToPath } from 'url'
import path from 'path'
import multer from 'multer'
import bcrypt, { genSaltSync } from 'bcrypt'

const createHash = password => bcrypt.hashSync(password,genSaltSync(10))
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.join(path.dirname(__filename), '../../')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/assets/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const uploader = multer({ storage })

export { uploader, __dirname, isValidPassword, createHash }

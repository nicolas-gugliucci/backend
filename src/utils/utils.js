import { fileURLToPath } from 'url'
import path from 'path'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.join(path.dirname(__filename), '../../')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(req.body.folderName ==='profiles' || req.body.folderName ==='products' || req.body.folderName ==='documents'){
            cb(null, `${__dirname}/public/assets/images/${req.body.folderName}`)
        }else{
            throw new Error('Incorrecct folder name')
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const uploader = multer({ storage })

export { uploader, __dirname, __filename }

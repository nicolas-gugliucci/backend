import {fileURLToPath} from 'url'
import path from 'path'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.join(path.dirname(__filename),'../../')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,__dirname+'/public/assets/images')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const uploader = multer({storage})

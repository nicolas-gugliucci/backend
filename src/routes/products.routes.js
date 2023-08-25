import { Router } from 'express'
import { uploader } from '../utils/utils.js'
import {
    getAll,
    getproduct,
    createProduct,
    updateOneProduct,
    deleteProduct
} from '../controllers/products.controller.js'

const router = Router()

router.get('/', getAll)
router.get('/:pid', getproduct)
router.post('/', uploader.array('thumbnails'), createProduct)
router.put('/:pid', uploader.array('thumbnails'), updateOneProduct)
router.delete('/:pid', deleteProduct)

export default router
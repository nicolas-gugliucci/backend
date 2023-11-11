import { Router } from 'express'
import { uploader } from '../utils/utils.js'
import { roleAuth } from '../middlewares/role.middleware.js'
import {
    getAll,
    getproduct,
    createProduct,
    updateOneProduct,
    deleteProduct
} from '../controllers/products.controller.js'

const router = Router()

router.get('/', getAll)
router.post('/', roleAuth(['admin','premium']), uploader.array('thumbnails'), createProduct)//admin||premium

router.get('/:pid', getproduct)
router.put('/:pid', roleAuth(['admin']), uploader.array('thumbnails'), updateOneProduct)//admin
router.delete('/:pid', roleAuth(['admin','premium']), deleteProduct)//admin||premium

// router.get('/', getAll)
// router.post('/', uploader.array('thumbnails'), createProduct)//admin||premium

// router.get('/:pid', getproduct)
// router.put('/:pid', uploader.array('thumbnails'), updateOneProduct)//admin
// router.delete('/:pid', deleteProduct)//admin||premium

export default router
import { Router } from 'express'
import { uploader } from '../utils/utils.js'
import { 
    getAll,
    createCart, 
    getCart, 
    addToCart, 
    deleteProduct, 
    deleteAll, 
    updateCart, 
    updateProduct 
} from '../controllers/cart.controller.js'


const router = Router()

router.get('/', getAll)
router.post('/', createCart)
router.get('/:cid', getCart)
router.post('/:cid/product/:pid', addToCart)
router.delete('/:cid/product/:pid', deleteProduct)
router.delete('/:cid', deleteAll)
router.put('/:cid', uploader.array(), updateCart)
router.put('/:cid/product/:pid', uploader.array(), updateProduct)

export default router
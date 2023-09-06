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
    updateProduct,
    purchase
} from '../controllers/cart.controller.js'
import { roleAuth } from '../middlewares/role.middleware.js'


const router = Router()

router.get('/', getAll)
router.post('/', createCart)
router.get('/:cid', getCart)
router.post('/:cid/product/:pid', roleAuth('user'), addToCart)//user
router.post('/:cid/purchase', roleAuth('user'), purchase)//user
router.delete('/:cid/product/:pid', roleAuth('user'), deleteProduct)//user
router.delete('/:cid', roleAuth('user'), deleteAll)//user
router.put('/:cid', uploader.array(), roleAuth('user'), updateCart)//user
router.put('/:cid/product/:pid', uploader.array(), roleAuth('user'), updateProduct)//user

export default router
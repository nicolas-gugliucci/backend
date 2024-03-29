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

router.get('/', roleAuth(['admin']), getAll)//admin
router.post('/', createCart)

router.get('/:cid', getCart)
router.put('/:cid', uploader.array(), roleAuth(['user','premium']), updateCart)//user||premium
router.delete('/:cid', roleAuth(['user','premium']), deleteAll)//user||premium

router.post('/:cid/product/:pid', roleAuth(['user','premium']), addToCart)//user||premium
router.put('/:cid/product/:pid', uploader.array(), roleAuth(['user','premium']), updateProduct)//user||premium
router.delete('/:cid/product/:pid', roleAuth(['user','premium']), deleteProduct)//user||premium

router.post('/:cid/purchase', roleAuth(['user','premium']), purchase)//user||premium


// router.get('/', getAll)//admin
// router.post('/', createCart)

// router.get('/:cid', getCart)
// router.put('/:cid', uploader.array(), updateCart)//user||premium
// router.delete('/:cid', deleteAll)//user||premium

// router.post('/:cid/product/:pid', addToCart)//user||premium
// router.put('/:cid/product/:pid', uploader.array(), updateProduct)//user||premium
// router.delete('/:cid/product/:pid', deleteProduct)//user||premium

// router.post('/:cid/purchase', purchase)//user||premium

export default router
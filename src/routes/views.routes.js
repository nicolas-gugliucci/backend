import {Router} from "express";
import {
    home,
    realTimeProducts,
    chat,
    products,
    cart,
    register,
    login,
    profile
} from '../controllers/views.controllers.js'

const router = Router()

router.get('/', home)
router.get('/realtimeproducts', realTimeProducts)
router.get('/chat', chat)
router.get('/products', products)
router.get('/carts/:cid', cart)
router.get('/register', register)
router.get('/login', login)
router.get('/profile', profile)

export default router
import {Router} from "express";
import { roleAuth } from "../middlewares/role.middleware.js";
import {
    home,
    realTimeProducts,
    chat,
    products,
    cart,
    register,
    login,
    profile,
    mockingproducts
} from '../controllers/views.controllers.js'

const router = Router()

router.get('/', home)
router.get('/realtimeproducts', realTimeProducts)
router.get('/chat', roleAuth('user'), chat)//user
router.get('/products', products)
router.get('/carts/:cid', cart)
router.get('/register', register)
router.get('/login', login)
router.get('/profile', profile)
router.get('/mockingproducts', mockingproducts)

export default router
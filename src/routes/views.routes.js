import { Router } from "express";
import { roleAuth } from "../middlewares/role.middleware.js";
import { expiredLink } from "../middlewares/resetPassword.middleware.js";
import {
    home,
    realTimeProducts,
    chat,
    products,
    cart,
    register,
    login,
    profile,
    mockingproducts,
    resetPassword,
    startResetPassword,
    info
} from '../controllers/views.controllers.js'

const router = Router()

router.get('/', home)
router.get('/realtimeproducts', realTimeProducts)
router.get('/chat', roleAuth(['user','premium']), chat)//user||premium
router.get('/products', products)
router.get('/carts/:cid', cart)
router.get('/register', register)
router.get('/login', login)
router.get('/profile', profile)
router.get('/mockingproducts', mockingproducts)
router.get('/resetPassword', expiredLink(), resetPassword)
router.get('/startresetPassword', startResetPassword)
router.get('/info', roleAuth(['admin']), info)

export default router
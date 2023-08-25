import { Router } from "express";
import { uploader } from '../utils/utils.js'
import passport from "passport";
import {
    logout,
    redirectLogin,
    login,
    failedLogin,
    failedRegister,
    githubcallback,
    getCurrent
} from '../controllers/session.controller.js'

const router = Router()

router.get('/logout', logout)
router.post(
    '/register', 
    passport.authenticate(
        'register', 
        {
            passReqToCallback:true, 
            session:false, 
            failureRedirect:'/api/sessions/failregister', 
            failureMessage:true
        }
    ), 
    uploader.array('img'), 
    redirectLogin
)
router.post('/login', login);
router.get('/failedLogin', failedLogin);
router.get('/failedRegister', failedRegister)
router.get(
    '/github', 
    passport.authenticate(
        'github',
        {scope:['user:email']}
    )
)
router.get(
    '/githubcallback', 
    passport.authenticate(
        'github',
        {failureRedirect:'/login'}
    ),
    githubcallback
)
router.get('/current', getCurrent)

export default router
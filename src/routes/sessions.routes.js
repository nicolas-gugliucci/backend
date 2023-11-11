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
    getCurrent,
    startChangePassword,
    resetPassword,
    changeRole,
    loadDocument,
    getAllUsers,
    deleteUsers,
    changeRoleByAdmin,
    deleteUserByAdmin
} from '../controllers/session.controller.js'
import { roleAuth } from "../middlewares/role.middleware.js";

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
router.post('/startChangePassword', startChangePassword)
router.post('/resetPassword', resetPassword)
router.get('/premium/:uid', roleAuth(['admin']), changeRole)//admin
router.post('/:uid/documents', uploader.array(), loadDocument)
router.post('/role/:uid', changeRoleByAdmin)
router.delete('/delete/:email', deleteUserByAdmin)


router.get('/', roleAuth(['admin']), getAllUsers)
router.delete('/', roleAuth(['admin']), deleteUsers)

const host = 'localhost:3000'; // Reemplaza esto con el host de tu aplicación
export default router
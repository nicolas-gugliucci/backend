import passport from "passport";
import { userDTO } from "../models/dtos/user.dto.js";

class sessionController {
    logout (req, res) {
        const sessionId = req.session.id
        req.session.destroy(err => {
            if (err) {
                return res.status(400).send({
                    status: "Error",
                    error: err.name,
                    message: err.message
                })
            }
            req.sessionStore.destroy(sessionId, err => {
                if (err) {
                    return res.status(400).send({
                        status: "Error",
                        error: err.name,
                        message: err.message
                    })
                }else res.send({status:'success', message:'Session destroyed'})
            })
        })
    }
    
    redirectLogin (req, res){
        res.redirect('/login')
    }
    
    login (req, res, next) {
        passport.authenticate('login', { passReqToCallback: true }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                const errorMessage = info.message || 'Authentication failed.';
                const userInfo = info.user
                return res.redirect(`/api/sessions/failedLogin?message=${errorMessage}&email=${userInfo.email}&password=${userInfo.password}`);
            }
    
            req.session.user = {
                name: `${user.first_name} ${user?.last_name}`,
                email: user.email,
                age: user.age,
                img: user.img,
                role: user.role,
                cart: user.cart
            };
            return res.redirect('/products');
        })(req, res, next)
    }
    
    failedLogin (req, res) {
        const email = req.query.email
        const password = req.query.password
        if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user = {
                first_name: 'User Admin',
                email: 'adminCoder@coder.com',
                age: '-',
                img: './assets/images/adminUser.png',
                role: 'Admin',
                cart: '64d804010b5c0fbe5bba975c'
            }
            return res.redirect('/products')
        }else{
            const errorMessage = req.query.message || 'Authentication failed.';
            console.log(errorMessage)
            res.send(`Failed login: ${errorMessage}`);
        }
    }
    
    failedRegister (req,res) {
        console.log(res.message)
        res.send('failed register')
    }
    
    githubcallback (req,res) {
        req.session.user={
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
            img: req.user.img,
            role: req.user.role,
            cart: req.user.cart
        }
        res.redirect('/products')
    }
   
    getCurrent (req, res) {
        const user = req.session.user
        console.log(req.session)
        const DTO = new userDTO(user)
        const safe_user_info = DTO
        res.send({status:'success', payload: safe_user_info})
    }
}

const controller = new sessionController()
const {
    logout,
    redirectLogin,
    login,
    failedLogin,
    failedRegister,
    githubcallback,
    getCurrent
} = controller

export {
    logout,
    redirectLogin,
    login,
    failedLogin,
    failedRegister,
    githubcallback,
    getCurrent
}
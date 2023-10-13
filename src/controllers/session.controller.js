import passport from "passport";
import { userDTO } from "../models/dtos/user.dto.js";
import { transport, MAIL, PORT_ENV } from "../config/config.js";
import UserService from "../services/user.service.js";
import { errors } from "../utils/errors/errorResponse.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import generarStringAleatorio from "../utils/text.js";

const service = new UserService()

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
                return res.status(403).send(err);
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

    async startChangePassword (req, res) {
        
        try{
            const {email} = req.body
            const user = await service.getById({email:email})
            if (!user) return errors(req, res, -16, null, null, null, email)
            const token = await createHash(generarStringAleatorio(10))
            const expirationTime = new Date();
            expirationTime.setHours(expirationTime.getHours() + 1);
            req.session.resetPasswordToken = token;
            req.session.resetPasswordExpires = expirationTime;
            req.session.user = {email:email}
            
            const mailParams = {
                from : `${MAIL}`,
                to : `${email}`,
                subject : 'Password recovery',
                html : 
                    `<div style="text-align: center;">
                        <h1>Reset your password</h1>
                        <p>To reset your password please click on the "Reset password" button</p>
                        <button style="background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 10px 0px;">
                            <a style="padding: 10px 20px; color: white; text-decoration: none;" target="_blank" href='http://localhost:${PORT_ENV}/resetPassword?token=${token}'>Reset password</a>
                        </button>
                    </div>`,
            }
            const reslut = await transport.sendMail(mailParams)
            res.send('E-mail sent')
        }catch(error){
            console.log(error) 
        }
    }

    async resetPassword (req, res) { 
        const {password} = req.body
        const user = await service.getById(req.session.user)
        if(isValidPassword(user, password)) return errors(req, res, -17)
        const secretPassword = await createHash(password)
        user.password = secretPassword
        try {
            const result = await service.updateUser(user._id, user)
            console.log(result)
            delete req.session.resetPasswordToken;
            delete req.session.resetPasswordExpires;
            delete req.session.user.email;
            res.send('Password reseted')
        } catch (error) {
            console.log(error)
        }
    }

    async changeRole (req, res) {
        try {
            const _id = req.params.uid
            const user = await service.getById({_id:_id})
            let role = user.role
            if(role==='user'){
                user.role = 'premium'
            }else{
                user.role = 'user'
            }
            const result = await service.updateUser({_id:_id}, user)
            res.send('Role updated')
        } catch (error) {
            console.log(error)
        }
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
    getCurrent,
    startChangePassword,
    resetPassword,
    changeRole
} = controller

export {
    logout,
    redirectLogin,
    login,
    failedLogin,
    failedRegister,
    githubcallback,
    getCurrent,
    startChangePassword,
    resetPassword,
    changeRole
}
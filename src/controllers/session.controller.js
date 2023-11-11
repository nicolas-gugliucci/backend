import passport from "passport";
import { userDTO } from "../models/dtos/user.dto.js";
import { transport, MAIL, PORT_ENV } from "../config/config.js";
import UserService from "../services/user.service.js";
import { errors } from "../utils/errors/errorResponse.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import generarStringAleatorio from "../utils/text.js";

const service = new UserService()

class sessionController {
    async logout (req, res) {
        const sessionId = req.session.id
        let user = await service.getById({email: req.session.user.email})
        user.last_connection = new Date()
        const result = await service.updateUser(user._id, user)
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
        passport.authenticate('login', { passReqToCallback: true }, async (err, user, info) => {
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
            let pearson = await service.getById({email: user.email})
            pearson.last_connection = new Date()
            const result = await service.updateUser(pearson._id, pearson)

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
            res.send({message:`Failed login: ${errorMessage}`});
        }
    }
    
    failedRegister (req,res) {
        console.log(res.message)
        res.send({message:'failed register'})
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
            res.send({message:'E-mail sent'})
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
            delete req.session.resetPasswordToken;
            delete req.session.resetPasswordExpires;
            delete req.session.user.email;
            res.send({message:'Password reseted'})
        } catch (error) {
            console.log(error)
        }
    }

    async changeRoleByAdmin (req, res){
        try {
            const _id = req.params.uid
            const newRoleByAdmin = req.body?.role
            let user = await service.getById({_id:_id})
            user.role = newRoleByAdmin
            const result = await service.updateUser({_id:_id}, user)
            res.send({messagge:'Role updated'})
        } catch (error) {
            console.log(error)
        }
    }

    async changeRole (req, res) {
        try {
            const _id = req.params.uid
            let user = await service.getById({_id:_id})
            let role = user.role
            if(role==='user'){
                if(user.status.identificacion && user.status.comprobante_domicilio && user.status.comprobante_estado_cuenta){
                    user.role = 'premium'
                }else{
                    return res.status(400).send('The documentation required is not completed')
                }
                
            }else{
                user.role = 'user'
            }
            const result = await service.updateUser({_id:_id}, user)
            res.send({message:'Role updated'})
        } catch (error) {
            console.log(error)
        }
    }

    async loadDocument (req, res) {
        try {
            if(!req.body.tipo_documento || !req.body.folderName) return errors(req,res,{error:'Incorret request', message:'Folder name and tipo_documento are required'})
            let files = req.files
            const _id = req.params.uid
            let user = await service.getById({_id:_id})
            if (files) {
                if (files.length !== 0) {
                    files.forEach(file => {
                        user.documents.push({
                            name: file.originalname,
                            reference: (file.path).slice(60, undefined)
                        })
                    });
                }
            }
            switch (req.body.tipo_documento) {
                case 'identificacion':
                    user.ststus.identificacion = true
                    break;
                case 'comprobante_domicilio':
                    user.ststus.comprobante_domicilio = true
                    break;
                case 'comprobante_estado_cuenta':
                    user.ststus.comprobante_estado_cuenta = true
                    break;
                default:
                    break;
            }
            const result = await service.updateUser(_id,user)
            res.send({message:'Document loaded'})
        } catch (error) {
            console.log(error)
        }
    }

    async getAllUsers(req, res){
        const users = (await service.getAll()).map(user => {
            delete user.age
            delete user.documents
            delete user.last_connection
            delete user.password
            delete user.img
            delete user.cart
            delete user.status
            return user
        })
        const data = {payload: users, status:'success'}
        res.json(data)
    }

    async deleteUsers(req, res){
        const limit_date = new Date()
        limit_date.setDate(limit_date.getDate() - 2);
        const users = await service.getAll();
        for (const user of users) {
            if (!user.last_connection || new Date(user.last_connection) < limit_date) {
                const email = user.email
                const name = user.first_name
                const result = await service.deleteUser(email);
                if (result.deletedCount === 1) {
                    const mailParams = {
                        from : `${MAIL}`,
                        to : `${email}`,
                        subject : 'Account Deactivation Confirmation',
                        html : `
                            <p>Dear ${name},</p>
                            <p>We regret to inform you that your account has been deactivated due to prolonged inactivity, and all associated data has been permanently removed. If you wish to reinstate your account, please create a new one.</p>`
                    }
                    const reslut = await transport.sendMail(mailParams)
                }
                res.send({message:'Users deleted'})
            } else {
                continue;
            }
        }
    }

    async deleteUserByAdmin (req, res) {
        const email = req.params.email
        const result = await service.deleteUser(email);
        res.send({message:'User deleted'})
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
    changeRole,
    loadDocument,
    getAllUsers,
    deleteUsers,
    changeRoleByAdmin,
    deleteUserByAdmin
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
    changeRole,
    loadDocument,
    getAllUsers,
    deleteUsers,
    changeRoleByAdmin,
    deleteUserByAdmin
}
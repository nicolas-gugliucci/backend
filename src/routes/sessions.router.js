import { Router } from "express";
import userModel from "../dao/models/Users.model.js";
import { uploader } from '../utils/utils.js'
import crypto from 'crypto'

const router = Router()

router.post('/register', uploader.array('img'), async (req, res) => {
    const {first_name, last_name, email, age, password} = req.body
    console.log(req.body)
    console.log(req.files)
    const exist = await userModel.findOne({email})
    let img = null
    if (req.files) {
        if (req.files.length !== 0) {
            img = req.files.map(file => file.path)
            thumbnails = thumbnails.map(e => e.slice(60, undefined))
        }
    }
    if(!img) img = './assets/images/user.png'
    if(exist) return res.status(400).send({status:'error', error:'The user already exist'})
    const salt = crypto.randomBytes(128).toString('base64')
    const cryptedPassword = crypto.createHmac('sha256', salt).update(password).digest('hex')
    const user= {
        first_name,
        last_name,
        email,
        age,
        salt,
        password: cryptedPassword,
        img
    }
    let result = await userModel.create(user)
    res.send({status:'success', message:'User registered'})
})

router.post('/login', async (req, res)=> {
    const {email, password} = req.body
    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user={
            name: 'User Admin',
            email: 'adminCoder@coder.com',
            age: '-',
            img: './assets/images/adminUser.png',
            rol: 'Admin'
        }
        res.send({status:'success', payload:req.session.user})
    }else{

        const user = await userModel.findOne({email})
        const cryptedPassword = crypto.createHmac('sha256',user.salt).update(password).digest('hex')
        
        if(!user || cryptedPassword !== user?.password) return res.status(400).send({status:'error', error:'Incorrect credentials'})
        req.session.user={
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            img: user.img,
            rol: user.rol
        }
        res.send({status:'success', payload:req.session.user})
    }
})

router.get('/logout', (req, res) =>{
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
})

export default router
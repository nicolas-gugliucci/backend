import { Router } from "express";
import userModel from "../dao/models/Users.model.js";
import { uploader } from '../utils/utils.js'
import crypto from 'crypto'
import passport from "passport";
import { isValidPassword } from "../utils/utils.js";

const router = Router()

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
        const user = await userModel.findOne({email:email})
        if(!user) return res.status(403).send({status:'error', error:'Incorrect credentials'})
        if(!isValidPassword(user,password)) return res.status(403).send({status:'error', error:'Incorrect credentials'})
        fetch('http://localhost:8080/api/carts',{
            method:'POST',
        }).then(result => {
            if (result.ok) {
                return result.json();
            }
        }).then(data => {
            const cid = data.payload._id
            req.session.user={
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                img: user.img,
                rol: user.rol,
                cart: cid
            }
            res.send({status:'success', payload:req.session.user})
        })
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

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), uploader.array('img'),async (req, res) => {
    res.redirect('/login')
})

router.get('/github',passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    let cid = null
    fetch('http://localhost:8080/api/carts',{
        method:'POST',
    }).then(result => {
        if (result.ok) {
            return result.json();
        }
    }).then(async data => {
        cid = data.payload._id
        req.session.user={
            name: req.user.first_name,
            email: req.user.email,
            age: req.user.age,
            img: req.user.img,
            cart: cid,
            rol: req.user.rol
        }
        res.redirect('/products')
    })
    
})

export default router
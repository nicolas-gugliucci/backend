import { Router } from "express";
import { uploader } from '../utils/utils.js'
import passport from "passport";

const router = Router()

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

router.post('/register', passport.authenticate('register', {passReqToCallback:true, session:false, failureRedirect:'/api/sessions/failregister', failureMessage:true}), uploader.array('img'), (req, res) => {
    res.redirect('/login')
})

router.post('/login', passport.authenticate('login', {passReqToCallback:true, failureRedirect:'/api/sessions/failedLogin'}),(req,res)=>{
    req.session.user={
        name: `${req.user.first_name} ${req.user?.last_name}`,
        email: req.user.email,
        age: req.user.age,
        img: req.user.img,
        role: req.user.role,
        cart: req.user.cart
    }
    res.redirect('/products')
    }
)

router.get('/failedLogin', (req,res)=> {
    console.log(req.authInfo)
    res.send('failed login')
})

router.get('/failedRegister', (req,res)=> {
    console.log(res.message)
    res.send('failed register')
})

router.get('/github',passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    req.session.user={
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        img: req.user.img,
        role: req.user.role,
        cart: req.user.cart
    }
    res.redirect('/products')
})

router.get('/current', (req, res) => {
    const user = req.session.user
    console.log(req.session)
    console.log(user)
    res.send({status:'success', payload: user})
})

export default router
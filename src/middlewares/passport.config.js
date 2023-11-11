import passport from "passport";
import local from "passport-local";
import {userModel} from "../models/schemas/user.schema.js";
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { CLIENT_ID, CLIENT_SECRET, PORT_ENV } from "../config/config.js";
import GitHubStrategy from 'passport-github2'
import generarStringAleatorio from "../utils/text.js";
import { __dirname, __filename } from "../utils/utils.js";

const LocalStrategy = local.Strategy

export const initPassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            { 
                passReqToCallback: true,
                usernameField: "email" 
            },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;

                try {
                    const exist = await userModel.findOne({email: username})
                    let img = null
                    if (req.files) {
                        if (req.files.length !== 0) {
                            img = req.files.map(file => file.path)
                            thumbnails = thumbnails.map(e => e.slice(60, undefined))
                        }
                    }
                    if (!img) img = './assets/images/user.png'
                    if (exist) return done('The user already exist')
                    if (!last_name) return done('Last name is obligatory')

                    const host = req.get('host');
                    const currentUrl = `https://${host}`;
                    const tofetch = `${currentUrl}/api/carts/`
                    fetch(tofetch,{
                        method:'POST',
                        body:JSON.stringify({}),
                        headers:{
                            'Content-Type':'application/json'
                        }
                    }).then(result => {
                        if (result.ok) {
                            return result.json();
                        }
                    }).then(async data => {
                        let cid = data?.payload?._id
                        const user= {
                            first_name,
                            last_name,
                            email,
                            age,
                            password: await createHash(password),
                            img,
                            cart: cid
                        }
                        let result = await userModel.create(user)
                        return done(null, result);
                    })
                } catch (error) {
                    return done("Error de usuaio" + error);
                }
            }
        )
    );
    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: `${CLIENT_ID}`,
                clientSecret: `${CLIENT_SECRET}`,
                callbackURL: `http://localhost:3000/api/sessions/githubcallback`
            },
            async (accessToken,refreshToken,profile, done) => {
                try {
                    console.log('1')
                    let newUser = {}
                    let user = {}
                    if(profile._json.email){
                        console.log('2')
                        user = await userModel.findOne({ email: profile._json.email })
                    }else {
                        console.log('2.1')
                        user = await userModel.findOne({ gitId: profile._json.id })
                    }               
                    if (!user) {
                        console.log('2.2')
                        console.log('no encontrado')
                        const password = generarStringAleatorio(10)
                        const cartsURL = `http://localhost:3000/api/carts`;

                        fetch(cartsURL, {
                            method:'POST',
                        }).then(result => {
                            if (result.ok) {
                                return result.json();
                            }
                        }).then(async data => {
                            let cid = data.payload._id
                            newUser = {
                                first_name: profile._json.name,
                                last_name: '',
                                email: profile._json.email?profile._json.email:profile._json.login,
                                age: '',
                                password: await createHash(password),
                                img: profile._json.avatar_url,
                                gitId: profile._json.id,
                                cart: cid
                            }
                            user = await userModel.create(newUser)
                            done(null, user)
                        })
                    } else {
                        done(null, user)
                    }
                }catch (error) {
                    return done(error)
                }
            }
        )
    );
    passport.use(
        'login', 
        new LocalStrategy(
            {
                passReqToCallback:true, 
                usernameField:'email'
            },
            async ( req, email, password, done ) => {
                try{
                    const user = await userModel.findOne({email:email})
                    if(!user) return done(null, false, {message:'not found',user:{email:email,password:password}})
                    const validatedPassword = await isValidPassword(user, password)
                    if(!validatedPassword) return done({message:'Incorrect credentials'}, false, {message:'Incorrect credentials'})
                    return done(null, user)
                }catch(error){
                    return done(error)
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })

};
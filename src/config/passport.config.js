import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/Users.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";

import GitHubStrategy from 'passport-github2'
import generarStringAleatorio from "../utils/text.js";

const LocalStrategy = local.Strategy;
export const initializedPassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
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
                    if (exist) throw new Error('The user already exist')
                    const user= {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        img
                    }
                    let result = await userModel.create(user)
                    return done(null, result);
                } catch (error) {
                    return done("Error de usuaio" + error);
                }
            }
        )
    );
}

export const initPassport = () => {
    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: `${process.env.CLIENT_ID}`,
                clientSecret: `${process.env.CLIENT_SECRET}`,
                callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
            }
            ,
            async (accesToken, refreshToken, profile, done) => {
                try {
                    let newUser = {}
                    let user = {}
                    if(profile._json.email){
                        user = await userModel.findOne({ email: profile._json.email })
                    }else {
                        user = await userModel.findOne({ gitId: profile._json.id })
                    }               
                    if (!user) {
                        const password = generarStringAleatorio(10)
                        newUser = {
                            first_name: profile._json.name,
                            last_name: '',
                            email: profile._json.email?profile._json.email:profile._json.login,
                            age: '',
                            password: createHash(password),
                            img: profile._json.avatar_url,
                            gitId: profile._json.id
                        }
                        const result = await userModel.create(newUser)
                        done(null, result)
                    } else {
                        done(null, user)
                    }
                }catch (error) {
                    return done(error)
                }
            }
        )
    );
};

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user)
})
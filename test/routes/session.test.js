import mongoose from "mongoose";
import {expect} from 'chai'
import supertest from 'supertest'
import {userModel} from "../../src/models/schemas/user.schema.js";
import UserDAO from "../../src/models/daos/mongoDB/users.dao.js";

const requester = supertest(`http://localhost:3000`)

const dao = new UserDAO()

describe("Testing session routes", () => {
    // after(async function (){
    //     this.timeout(15000)
    //     const user = {
    //         first_name: 'c',
    //         last_name: 'e',
    //         email: 'nico@a.com',
    //         password: '123',
    //         img: './assets/images/Bode.png',
    //     }
    //     const result20 = await dao.saveUser(user)
    //     const result200 = await dao.deleteUser('nico@gmail.com')
    //     //const result = await model.deleteOne({email:"nico@gmail.com"})
    //     //const result2 = await model.deleteOne({email:"nico2@gmail.com"})
    //     console.log(result20)
    //     console.log(result200)
    // })

    //ok, hay q borrar al final el usuario para que se haga bien.
    it("[POST] - Registers a user", async function(){
        const user = {
            first_name: 'Nicolás',
            last_name: 'Gugliucci',
            email: 'nico@gmail.com',
            password: '123',
            img: './assets/images/Bode.png',
        }
        const response = await requester.post('/api/sessions/register').send(user)
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(302)
        const redirectURL = response.header.location
        const redirectResponse = await requester.get(redirectURL)
        expect(redirectResponse.req.path).to.be.eql('/login')
    })

    it("[POST] - Rejects a user with missing mandatory input", async function(){
        const user = {
            first_name: 'Nicolás',
            email: 'nico2@gmail.com',
            password: '123',
            img: './assets/images/Bode.png',
        }
        const response = await requester.post('/api/sessions/register').send(user)
        expect(response.statusCode).to.be.eql(400)
    })

    it("[POST] - Rejects repeated email", async function(){
        const user = {
            first_name: 'Nicolás',
            last_name: 'Gugliucci',
            email: 'nico@gmail.com',
            password: '123',
            img: './assets/images/Bode.png',
        }
        const response = await requester.post('/api/sessions/register').send(user)
        expect(response.statusCode).to.be.eql(400)
    })

    it("[POST] - Registered person trying to log in", async function(){
        const user = {
            email: 'nico@gmail.com',
            password: '123',
        }
        const response = await requester.post('/api/sessions/login').send(user)
        expect(response.statusCode).to.be.eql(302)
        const redirectURL = response.header.location
        const redirectResponse = await requester.get(redirectURL)
        expect(redirectResponse.req.path).to.be.eql('/products')
    })

    it("[POST] - Registered person trying to log in with the wrong password", async function(){
        const user = {
            email: 'nico@gmail.com',
            password: '1234',
        }
        const response = await requester.post('/api/sessions/login').send(user)
        expect(response.statusCode).to.be.eql(403)
        expect(response.body.message).to.be.eql('Incorrect credentials')  
    })
    
    it("[POST] - Not registered person trying to log in", async function(){
        const user = {
            email: 'nico3@gmail.com',
            password: '123',
        }
        const response = await requester.post('/api/sessions/login').send(user)
        expect(response.statusCode).to.be.eql(302)
        const redirectURL = response.header.location
        const redirectResponse = await requester.get(redirectURL)
        expect(redirectResponse.text).to.be.eql('Failed login: not found')  
    })

    //pasar la session para que cierre la session
    it("[GET] - Logged-in person trying to log out", async function(){
        const response = await requester.get('/api/sessions/logout').set('Cookie', ['connect.sid=s%3AVzPBfUdYeZCuaWi1smsNZRPB0g9nnKCq.52k9Xe1AuY978PtsS54GdDlKAsUL7Q%2Fg9XWkBiivNLs'])
        expect(response.statusCode).to.be.eql(200)
    })

    // //pasar info de session para que devuelva el current
    // it("[GET] - Get current session", async function(){
    //     const response = await requester.get('/api/sessions/current')
    //     expect(response.statusCode).to.be.eql(200)
    // })

    // //nt
    // it("[POST] - Send email in order to change the password", async function(){
    //     this.timeout(10000)
    //     const response = await requester.post('/api/sessions/startChangePassword').send({email: 'gugliucci.nicolas@gmail.com'})
    //     expect(response.statusCode).to.be.eql(200)
    // })

    // //nt chequear body con password
    // it("[POST] - Reset user password", async function(){
    //     const response = await requester.post('/api/sessions/resetPassword').send({password: 1235})
    //     expect(response.statusCode).to.be.eql(200)
    // })

    // //nt, encontrar diferecnciación entre aceptado y error por algo
    // it("[POST] - User with changed password trying to login with thier new password", async function(){
    //     const user = {
    //         email: 'nico@gmail.com',
    //         password: '1235',
    //     }
    //     const response = await requester.post('/api/sessions/login').send(user)
    //     expect(response.statusCode).to.be.eql(302)
    // })

    // //nt
    // it("[POST] - Change between premium - user", async function(){
    //     const user = {
    //         first_name: 'Alberto',
    //         last_name: 'Gómez',
    //         email: 'user-premium@gmail.com',
    //         password: '123'
    //     }
    //     const id = (await requester.post('/api/sessions/register').send(user)).body.payload._id
    //     const response = await requester.post(`/api/sessions/premium/${id}`).set('Cookie', ['connect.sid=s%3AVzPBfUdYeZCuaWi1smsNZRPB0g9nnKCq.52k9Xe1AuY978PtsS54GdDlKAsUL7Q%2Fg9XWkBiivNLs'])
    //     expect(response.statusCode).to.be.eql(200)
    //     const current = await requester.get('/api/sessions/current').set('Cookie', ['connect.sid=s%3AVzPBfUdYeZCuaWi1smsNZRPB0g9nnKCq.52k9Xe1AuY978PtsS54GdDlKAsUL7Q%2Fg9XWkBiivNLs'])
    //     expect(current.payload.role).to.be.eql(previous==='premium'?'user':'premium')
    // })
})

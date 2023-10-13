import {expect} from 'chai'
import supertest from 'supertest'

const requester = supertest(`http://localhost:3000`)
let pid

describe("Testing products routes", () => {

    it("[GET] - Gets all products created", async function(){
        const response = await requester.get('/api/products')      
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
    })

    it("[POST] - Creates a product", async function(){
        const product = {
            title: 'Testing',
            description: 'This is a product for testing',
            code:'TESTING',
            price:889,
            stock:23,
            category:'Test'
        }
        const response = await requester.post('/api/products').send(product)
        pid = response.body.payload._id
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.payload).to.have.property('_id');
    })

    it("[GET] - Gets a products by id", async function(){
        const response = await requester.get(`/api/products/${pid}`)      
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.payload.code).to.be.eql('TESTING')
        expect(response.body.payload).to.have.property('_id');
    })

    it("[PUT] - Gets a products by id", async function(){
        const response = await requester.put(`/api/products/${pid}`).send({description:'This is a description modifyed for testing'})    
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.message).to.be.eql('Product updated')
        const changed = await requester.get(`/api/products/${pid}`) 
        expect(changed.body.payload.description).to.be.eql('This is a description modifyed for testing')
    })

    it("[DELETE] - Deletes a products by id", async function(){
        const response = await requester.delete(`/api/products/${pid}`)
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.message).to.be.eql('Product deleted')
        const notFoundExpected = await requester.get(`/api/products/${pid}`) 
        expect(notFoundExpected.statusCode).to.be.eql(404)
    })
})

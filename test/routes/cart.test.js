import {expect} from 'chai'
import supertest from 'supertest'

const requester = supertest(`http://localhost:3000`)
let id
let pid = null
try {
    pid = (await requester.get('/api/products')).body.payload[0]._id
} catch (error) {}  

describe("Testing cart routes", () => {

    //pasar session (admin necesario)
    it("[GET] - Gets all carts created", async function(){
        const response = await requester.get('/api/carts')      
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
    })

    it("[POST] - Creates a new cart", async function(){
        const response = await requester.post('/api/carts')
        id = response.body.payload._id
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.payload).to.have.property('_id');
    })

    it("[GET] - Get products from a cart by id", async function(){
        const response = await requester.get(`/api/carts/${id}`) 
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.payload).to.be.an('array')
        
    })
    
    //agregar session (user o premium)
    it("[PUT] - Change the products in the cart for a new array of products\n\t The getProducts request must have passed the test successfully", async function(){
        const prods = (await requester.get('/api/products')).body.payload
        const p1 = prods[1]._id
        const p2 = prods[2]._id
        
        
        const newData = {
            status: 'success',
            prevLink: null,
            nextLink: 'http://localhost:<PORT>/api/products?limit=5&page=2',
            totalPages: 2,
            page: 1,
            hasPrevPage: false,
            hasNextPage: true,
            prevPage: null,
            nextPage: 2,
            payload:
            [
                {
                    thumbnails: [
                        "\\assets\\images\\image_1.png",
                        "\\assets\\images\\image_2.jpng"
                    ],
                    price: 599,
                    code: "AAB058",
                    status: true,
                    owner: "mail@example.com",
                    stock: 20,
                    title: "Guitar",
                    _id: p1,
                    description: "Half-Sized Acoustic Guitar",
                    category: "music"
                },
                {
                    thumbnails: [
                        "\\assets\\images\\image_1.png",
                        "\\assets\\images\\image_2.jpng"
                    ],
                    price: 599,
                    code: "AAB059",
                    status: true,
                    owner: "mail@example.com",
                    stock: 20,
                    title: "Piano",
                    _id: p2,
                    description: "Half-Sized Acoustic Guitar",
                    category: "music"
                }
            ]
        }
        const response = await requester.put(`/api/carts/${id}`).send(newData)
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.message).to.be.eql('Cart updated')
    })

    //agregar session (user o premium), chequear respuesta
    it("[DELETE] - Delete all product from the cart specifyed", async function(){
        const response = await requester.delete(`/api/carts/${id}`)
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.message).to.be.eql('Cart emptied')
    })

    //agregar session (user o premium)
    it("[POST] - Add a product to a cart \n\t The getProducts request must have passed the test successfully", async function(){
        const response = await requester.post(`/api/carts/${id}/product/${pid}`)
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        const elementWithSpecificIdExists = response.body.payload.products.some((element) => element._id._id === pid);
        expect(elementWithSpecificIdExists).to.be.true;
    })

    //agregar session (user o premium)
    it("[PUT] - Change the quantity of a product into a cart \n\t The getProducts request must have passed the test successfully", async function(){
        this.timeout(10000)
        const expectedQuantity = 7
        const response = await requester.put(`/api/carts/${id}/product/${pid}`).send({quantity:expectedQuantity})
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.message).to.be.eql('Product updated in cart')
        const prodsInCart = await requester.get(`/api/carts/${id}`) 
        const quantity = (prodsInCart.body.payload.find((element) => element._id._id === pid))?.quantity
        expect(quantity).to.be.eql(expectedQuantity)
    })

     //agregar session (user o premium)
     it("[DELETE] - Delete a product from a cart \n\t The getProducts request must have passed the test successfully", async function(){
        const response = await requester.delete(`/api/carts/${id}/product/${pid}`)
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.message).to.be.eql('Product deleted from cart')
        const prodsInCart = await requester.get(`/api/carts/${id}`) 
        const product = (prodsInCart.body.payload.some((element) => element._id._id === pid))
        expect(product).to.be.false
    })

    //agregar session (user o premium)
    it("[POST] - Purchase the order", async function(){
        this.timeout(10000)
        await requester.post(`/api/carts/${id}/product/${pid}`)
        const response = await requester.post(`/api/carts/${id}/purchase/`)
        expect(response).to.be.ok
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.ticket).to.have.property('_id')
        expect(response.body).to.have.property('not_processed')
    })

})

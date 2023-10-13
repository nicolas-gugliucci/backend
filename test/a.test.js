import mongoose from "mongoose";
import Assert from 'assert'
// import UserDao from ...
mongoose.connect(`...`)

describe("Testing user dao", () => {
    before(function(){
        this.userDao = new userDao()
    })
    beforeEach(function(){
        this.timeout(5000)
    })
    it("El dao debe devolver los usuarios en formato arreglo",async function(){
       Assert.ok(this.userDao)
        const isArray = true


        const result = await this.userDao.get()

        
        Assert.strictEqual(Array.isArray(result),isArray)
    })
})

describe("Testing product dao", () => {

})



// import mongoose from "mongoose";
// import {DATABASE_TEST_URL, PORT_ENV} from '../../src/config/config.js'
// import {expect} from 'chai'
// import supertest from 'supertest'
// import session from 'supertest-session'



// const requester = supertest(`http://localhost:3000`)
// const testSession = session(`http://localhost:3000`);

// const dropPets =async ()=>{

//     await petModel.collection.drop()

// }

// describe("Testing cart routes", () => {
//     before(async function (){
//         this.timeout(5000);
//         await mongoose.connect(`mongodb+srv://nicogna9:654321NicO@coderbackend.vcz3dr4.mongodb.net/ecommerce-testing?retryWrites=true&w=majority`)
    
//     })
    
//     after(async function (){
    
//         mongoose.connection.close();
    
//     })
//     // before(function(){
//     //     //this.userDao = new userDao()
//     // })
//     // beforeEach(function(){
//     //     this.timeout(500)
//     //     mongoose.connection.collections.users.drop()
//     // })
//     it("[GET] - Gets all carts created", async function(){
//         const response = await requester.get('/api/carts')      
//         //console.log(response)
//         expect(response).to.be.ok
//         expect(response.statusCode).to.be.eql(200)
//         //expect(response.body.payload).to.have.property('_id');
//     })
//     it("[POST] - Creates a new cart", async function(){
//         const response = await requester.post('/api/carts')
//         expect(response).to.be.ok
//         expect(response.statusCode).to.be.eql(200)
//         expect(response.body.payload).to.have.property('_id');
//     })
// })

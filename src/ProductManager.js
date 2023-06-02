import fs from 'fs'

export default class ProductManager {
    constructor(){
        this.path="./Products.JSON"
    }
    
    async addProduct({title, description, price, thumbnail, code, stock}){
        let id = null
        let products = null
        if(arguments.length!=1){
            console.error("Only an object has been expected");
            return
        }
        if(Object.values(arguments[0]).length!==6){
            console.error("Six parameters expected");
            return
        }else if(Object.values(arguments[0]).some((argument) => argument.length === 0)){
            console.error("All parameters must include relevant information");
            return
        }
        if(fs.existsSync(this.path)){
            products = await this.getProducts()
            if(products.some((product) => product.code === code)){
                console.error("This code has already been used");
                return
            }else{
                id = products[products.length - 1].id + 1
            }
        }else{
           id = 1
           products = []
        }
        
        let product = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: id
        }
        products.push(product)
        try{
            await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'))
        }
        catch(error){
            console.error(error)
        }
    }
    async getProducts(){
        return fs.existsSync(this.path) 
            ? JSON.parse(await fs.promises.readFile(this.path,'utf-8')) // y si no lee?
            : []
    }
    async getProductById(id){
        let products = await this.getProducts()
        let product = products.find((prod) => prod.id === Number(id))
        if(!product){
            console.error("Not found");
        }else{
            return product
        }
    }
    async updateProduct(id, campo, update){
        let product = await this.getProductById(id)
        let products = await this.getProducts()
        products[products.map(object => object.id).indexOf(product.id)][campo]= update
        try{
            await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'))
        }
        catch(error){
            console.error(error)
        }
    }
    async deleteProduct(id){
        let products = await this.getProducts()
        if(products.some((prod)=>prod.id===Number(id))){
            products.splice(products.map(object => object.id).indexOf(Number(id)),1)
            try{
                await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'))
            }
            catch(error){
                console.error(error)
            }
        }else{
            console.error(`No product found with ID=${id}`)
        }
    }
}
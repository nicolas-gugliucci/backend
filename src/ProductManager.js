import fs from 'fs'

export default class ProductManager {
    constructor(){
        this.path="../data/Products.JSON"
    }
    
    async addProduct({title, description, code, price, stock, category, thumbnails}){
        let id = null
        let products = null
        if(arguments.length!=1){
            //console.error("Only an object is expected");
            return -1
        }
        if(Object.values(arguments[0]).length!==7&&!(Object.values(arguments[0]).length==6 && !thumbnails)){
            //console.error("Five or six parameters expected");
            //console.warn("Your product must have the folowings camps:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-Thumbnails <--(opcional)")
            return -2
        }else if(Object.values(arguments[0]).some((argument) => argument.length === 0)){
            //console.error("All parameters must include relevant information");
            return -3
        }
        if(fs.existsSync(this.path)){
            products = await this.getProducts()
            if(products.some((product) => product.code === code)){
                //console.error("This code has already been used");
                return -4
            }else{
                id = products[products.length - 1].id + 1
            }
        }else{
           id = 1
           products = []
        }
        
        let product = {
            id: id,
            title: title,
            description: description,
            code: code,
            price: Number(price),
            status: true,
            stock: Number(stock),
            category: category,
            thumbnails: thumbnails
        }
        products.push(product)
        try{
            await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'))
        }
        catch(error){
            //console.error(error)
            return error
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
            return -1
        }else{
            return product
        }
    }
    async updateProduct(id, update){
        let product = await this.getProductById(id)
        if(product===-1) return -1
        let products = await this.getProducts()
        const productIndex = products.map(object => object.id).indexOf(product.id)
        const values = Object.values(update)
        const keys = Object.keys(update)
        const aceptados = ["title", "description", "code", "price", "stock", "category", "thumbnails"]
        for (let i = 0; i < values.length; i++) {
            if(aceptados.indexOf(values[i])===-1) return -2
            if(keys[i].length===0) return -3
            products[productIndex][keys[i]] = values[i]
        }
        //products[products.map(object => object.id).indexOf(product.id)][campo]= update //debe funcionar con u paso de objeto que tenga todos los valores a modificar
        try{
            await fs.promises.writeFile(this.path,JSON.stringify(products,null,'\t'))
        }
        catch(error){
           // console.error(error)
           return error
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
                //console.error(error)
                return error
            }
        }else{
            return -1
            //console.error(`No product found with ID=${id}`)
        }
    }
}
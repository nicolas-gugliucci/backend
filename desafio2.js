import fs from 'fs'

class ProductManager {
    constructor(){
        this.path="./data/Products.JSON"
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
        let product = products.find((prod) => prod.id === id)
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
        if(products.some((prod)=>prod.id===id)){
            products.splice(products.map(object => object.id).indexOf(id),1)
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


/*---------------------------------------------Testing--------------------------------------------*/
let test = new ProductManager()
let products = await test.getProducts()
console.log(`
------------------------------------------------------------------------
            `)
console.log(`Array productos inicial:`)
console.log(products)
console.log(`
------------------------------------------------------------------------
            `)
let producto={
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
}
await test.addProduct(producto)
products = await test.getProducts()
console.log(`Array productos con primer producto agregado:`)
console.log(products)
console.log(`
------------------------------------------------------------------------
            `)
console.log('Agregar producto con igual código:')
await test.addProduct(producto)
console.log(`
------------------------------------------------------------------------
            `)
console.log('Producto según id=1:')
let product = await test.getProductById(1)
console.log(product)
console.log(`
------------------------------------------------------------------------
            `)
console.log('Producto según id=2:')
product = await test.getProductById(2)
console.log(product)
console.log(`
------------------------------------------------------------------------
            `)

console.log("Campos obligatorios:")
console.log("1.")
producto={
    title: "",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
}
await test.addProduct(producto)

console.log("2.")
producto={
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
}
await test.addProduct(producto)
console.log(`
------------------------------------------------------------------------
            `)

console.log("ID autoincrementable:")
producto={
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc124",
    stock: 25,
}
await test.addProduct(producto)
producto={
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc17",
    stock: 25,
}
await test.addProduct(producto)
producto={
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc193",
    stock: 25,
}
await test.addProduct(producto)
producto={
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abd173",
    stock: 25,
}
await test.addProduct(producto)
products = await test.getProducts()
console.log(products)
console.log(`
------------------------------------------------------------------------
            `)
console.log('Update de producto con ID=3, campo a modificar: titulo = nuevo titulo')
await test.updateProduct(3,'title','nuevo titulo')
products = await test.getProducts()
console.log(products)
console.log(`
------------------------------------------------------------------------
            `)
console.log('Delete de producto con ID=2')
await test.deleteProduct(2)
products = await test.getProducts()
console.log(products)
console.log(`
------------------------------------------------------------------------
            `)
console.log('Delete de producto con ID=10 (inexistente)')
await test.deleteProduct(10)
console.log(`
------------------------------------------------------------------------
            `)
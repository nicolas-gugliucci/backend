import fs from 'fs'
import ProductManager from './ProductManager.js'

export default class CartManager {
    constructor(){
        this.path="../data/Carts.JSON"
    }
    async getCarts(){
        return fs.existsSync(this.path) 
            ? JSON.parse(await fs.promises.readFile(this.path,'utf-8')) // y si no lee?
            : []
    }
    async getCartById(cid){
        let carts = await this.getCarts()
        let cart = carts.find((cart) => cart.id === Number(cid))
        if(!cart){
            return -1
        }else{
            return cart.products
        }
    }
    async newCart(){
        let id = null
        let carts = null
        if(fs.existsSync(this.path)){
            carts = await this.getCarts()
            id = carts[carts.length - 1].id + 1
        }else{
           carts = []
           id = 1
        }
        let cart = {
            id: id,
            products: []
        }
        carts.push(cart)
        try{
            await fs.promises.writeFile(this.path,JSON.stringify(carts,null,'\t'))
        }
        catch(error){
            return error
        }
        return 1
    }
    async addProductToCart(cid, pid){
        
        const carts = await this.getCarts()
        const cartIndex = carts.map(object => object.id).indexOf(cid)
        if(!cartIndex) return -1
        const productIndex = carts[cartIndex].products.map(object => object.id).indexOf(pid)
        if(productIndex===-1){
            const productManager = new ProductManager
            if(productManager.getProductById(pid)===-1){
                return -2
            }
            const product = {
                product: pid,
                quantity: 1
            }
            carts[cartIndex].products.push(product)
        }else{
            carts[cartIndex].products[productIndex] += 1
        }
        try{
            await fs.promises.writeFile(this.path,JSON.stringify(carts,null,'\t'))
        }
        catch(error){
           return error
        }
        return 1
    }
}
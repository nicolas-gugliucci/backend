import ProductService from './product.service.js'
import CartDAO from "../models/daos/mongoDB/carts.dao.js"

const ProdService = new ProductService()
const dao = new CartDAO()

export default class CartService{

    async getCarts() {
        const carts = await dao.getCarts()
        return carts
    }
    async getCartById(cid, expanded) {
        const cart = await dao.getCartById(cid, expanded)
        return cart
    }
    async newCart() {
        const result = await dao.newCart()
        return result
    }
    async addProductToCart(cid, pid) {
        const product = await ProdService.getProductById(pid)
        if (product === -4 || product?.error) return product
        const result = await dao.addProductToCart(cid, pid)
        return result
    }
    async deleteProductFromCart(pid, cid) {
        const result = await dao.deleteProductFromCart(pid, cid)
        return result
    }
    async deleteAllFromCart(cid) {
        const result = await dao.deleteAllFromCart(cid)
        return result
    }
    async updateQuantity(cid, pid, quant) {
        const result = await dao.updateQuantity(cid, pid, quant)
        return result
    }
    async completeUpdate(cid, update) {
        const aceptados = ["status", "payload", "totalPages", "prevPage", "nextPage", "page", "hasPrevPage", "hasNextPage", "prevLink", "nextLink"]
        const keys = Object.keys(update)
        if (keys.some((key) => !aceptados.includes(key))) return -15
        if (aceptados.some((key) => !keys.includes(key))) return -15
        const newProducts = []
        const newArray = update.payload.map((e) => e._id)
        for (let i = 0; i < newArray.length; i++) {
            const id = newArray[i];
            const productRequested = await ProdService.getProductById(id)
            if (productRequested === -4 || productRequested?.error) return { result: productRequested, id: id }
        }
        newArray.forEach(element => {
            newProducts.push({
                _id: element,
                quantity: 1
            })
        });
        const result = await dao.completeUpdate(cid, newProducts)
        return result
    }
}
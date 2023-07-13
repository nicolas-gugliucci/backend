import { cartModel } from "../models/carts.js"
import productManager from '../dbManagers/products.js'

export default class Carts {
    constructor() { }

    async getCarts() {
        let carts
        try {
            carts = await cartModel.find().lean()
        } catch (error) {
            return { message: error.message, error: error.name }
        }
        return carts
    }
    async getCartById(cid) {
        let cart
        try {
            cart = await cartModel.findOne({ _id: cid }).lean()
            if (!cart) return -10
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -10
            else return { message: error.message, error: error.name }
        }
        return cart
    }
    async newCart() {
        let result
        try {
            result = await cartModel.create({})
        } catch (error) {
            return { message: error.message, error: error.name }
        }
        return 1
    }
    async addProductToCart(cid, pid) {
        const manager = new productManager()
        const product = await manager.getProductById(pid)
        if (product === -4 || product?.error) return product
        let cart
        try {
            if ((await this.getCartById(cid)).products?.some((prod) => prod._id === pid)) {
                cart = await cartModel.updateOne(
                    {
                        _id: { $eq: cid }
                    },
                    {
                        $inc: {
                            'products.$[elem].quantity': 1
                        }
                    },
                    {
                        arrayFilters: [
                            {
                                'elem._id': { $eq: pid }
                            }
                        ]
                    }
                )
            } else {
                cart = await cartModel.updateOne(
                    {
                        _id: { $eq: cid }
                    },
                    {
                        $push: {
                            products: {
                                _id: pid,
                                quantity: 1
                            }
                        }
                    }
                )
            }
        } catch (error) {
            if (error.reason.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -10
            return { message: error.message, error: error.name }
        }
        return 1
    }
}
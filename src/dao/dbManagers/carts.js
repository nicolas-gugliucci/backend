import { cartModel } from "../models/carts.js"
import productManager from '../dbManagers/products.js'
import { sendMessage } from "../../utils/socket-io.js"

const manager = new productManager()

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
    async getCartById(cid, expanded) {
        let cart = undefined
        try {
            cart = expanded ? await cartModel.findOne({ _id: cid }).populate("products._id").lean() : await cartModel.findOne({ _id: cid }).lean()
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
            sendMessage('newCart', result.id)
        } catch (error) {
            return { message: error.message, error: error.name }
        }
        return { error: 1, result }
    }
    async addProductToCart(cid, pid) {
        const manager = new productManager()
        const product = await manager.getProductById(pid)
        if (product === -4 || product?.error) return product
        let cart
        try {
            if ((await this.getCartById(cid)).products?.some((prod) => prod._id == pid)) {
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
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -10
            return { message: error.message, error: error.name }
        }
        return 1
    }
    async deleteProductFromCart(pid, cid) {
        try {
            const result = await cartModel.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: { _id: pid } } },
            )
            if (!result.products.length) return -12
            if (!result) return -10
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') {
                if ((error.message).includes('because of "BSONError"')) return -4
                if ((error.message).includes('for model "carts"')) return -10
            }
            else return { message: error.message, error: error.name }
        }
        return 1
    }
    async deleteAllFromCart(cid) {
        try {
            const result = await cartModel.updateOne(
                { _id: cid },
                { $set: { products: [] } }
            )
            if (!result.matchedCount) return -10
            if (!result.modifiedCount) return -13
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -10
            else return { message: error.message, error: error.name }
        }
        return 1
    }
    async updateQuantity(cid, pid, quant) {
        try {
            const result = await cartModel.findOneAndUpdate(
                { _id: cid, "products._id": pid },
                { $set: { "products.$.quantity": quant } }
            )
            if (!result) return -14
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -14
            else return { message: error.message, error: error.name }
        }
        return 1
    }
    async completeUpdate(cid, update) {
        const aceptados = ["status", "payload", "totalPages", "prevPage", "nextPage", "page", "hasPrevPage", "hasNextPage", "prevLink", "nextLink"]
        const keys = Object.keys(update)
        if (keys.some((key) => !aceptados.includes(key))) return -15
        if (aceptados.some((key) => !keys.includes(key))) return -15
        try {
            // for (const element in update.payload) {
            //     await addProductToCart(cid, element._id)
            // }
            const newProducts = []
            const newArray = update.payload.map((e) => e._id)
            for (let i = 0; i < newArray.length; i++) {
                const id = newArray[i];
                const productRequested = await manager.getProductById(id)
                if (productRequested === -4 || productRequested?.error) return { result: productRequested, id: id }
            }
            newArray.forEach(element => {
                newProducts.push({
                    _id: element,
                    quantity: 1
                })
            });
            await cartModel.updateOne(
                { _id: cid },
                { products: newProducts }
            )
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -10
            else return { message: error.message, error: error.name }
        }
        return 1
    }
}
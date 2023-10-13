import { cartModel } from "../../schemas/cart.schema.js"
import ProductService from "../../../services/product.service.js"
import {sendMessage} from '../../../utils/socket-io.js'

const manager = new ProductService()

export default class CartDAO {

    async getCarts() {
        try {
            const carts = await cartModel.find().lean()
            return carts
        } catch (error) {
            return { message: error.message, error: error.name }
        }
    }
    async getCartById(cid, expanded) {
        try {
            const cart = expanded ? await cartModel.findOne({ _id: cid }).populate("products._id").lean() : await cartModel.findOne({ _id: cid }).lean()
            if (!cart) return -10
            return cart
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -10
            else return { message: error.message, error: error.name }
        }
        
    }
    async newCart() {
        try {
            const result = await cartModel.create({})
            sendMessage('newCart', result.id)
            return { error: 1, result }
        } catch (error) {
            return { message: error.message, error: error.name }
        }
    }
    async addProductToCart(cid, pid) {
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
            return {error:1, cart:cart}
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -10
            return { message: error.message, error: error.name }
        }
    }
    async deleteProductFromCart(pid, cid) {
        try {
            const result = await cartModel.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: { _id: pid } } },
            )
            if (!result.products.length) return -12
            if (!result) return -10
            return 1
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') {
                if ((error.message).includes('because of "BSONError"')) return -4
                if ((error.message).includes('for model "carts"')) return -10
            }
            else return { message: error.message, error: error.name }
        }
    }
    async deleteAllFromCart(cid) {
        try {
            const result = await cartModel.updateOne(
                { _id: cid },
                { $set: { products: [] } }
            )
            if (!result.matchedCount) return -10
            if (!result.modifiedCount) return -13
            return 1
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -10
            else return { message: error.message, error: error.name }
        }
    }
    async updateQuantity(cid, pid, quant) {
        try {
            const result = await cartModel.findOneAndUpdate(
                { _id: cid, "products._id": pid },
                { $set: { "products.$.quantity": quant } }
            )
            if (!result) return -14
            return 1
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -14
            else return { message: error.message, error: error.name }
        }
    }
    async completeUpdate(cid, newProducts) {
        try {
            await cartModel.updateOne(
                { _id: cid },
                { products: newProducts }
            )
            return 1
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -10
            else return { message: error.message, error: error.name }
        }
    }
}
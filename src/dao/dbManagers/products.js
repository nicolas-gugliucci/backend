import { productModel } from "../models/products.js"

export default class Carts {
    constructor() { }

    async addProduct({ title, description, code, price, stock, category, thumbnails }) {
        if (arguments.length != 1) return -1
        const aceptados = ["title", "description", "code", "price", "stock", "category", "thumbnails"]
        if (Object.keys(arguments[0]).some((key) => !aceptados.includes(key))) return -2
        if (Object.values(arguments[0]).some((value) => value.length === 0)) return -3
        if (!isNaN(title) || !isNaN(description) || !isNaN(category)) return -5
        if (thumbnails && !Array.isArray(thumbnails)) return -6
        let product = {
            title: title,
            description: description,
            code: code,
            price: price,
            status: true,
            stock: stock,
            category: category
        }
        if (thumbnails) product = { ...product, thumbnails }
        try {
            await productModel.create(product)
        } catch (error) {
            if (error.code === 11000) return -7
            else return { message: error.message, error: error.name }
        }
        return 1
    }
    async getProducts(limit) {
        let products
        try {
            products = await productModel.find({}, {}, { limit: limit }).lean()
        } catch (error) {
            if (error.name === "CastError") return -8
            else return { message: error.message, error: error.name }
        }
        return products
    }
    async getProductById(id) {
        let product
        try {
            product = await productModel.findOne({ _id: id }).lean()
            if (!product) return -4
        } catch (error) {
            if (error.reason.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -4
            else return { message: error.message, error: error.name }
        }
        return product
    }
    async updateProduct(id, update) {
        if (update.length === 0) return -5
        const aceptados = ["title", "description", "code", "price", "stock", "category", "thumbnails", "status"]
        const keys = Object.keys(update)
        if (keys.some((key) => !aceptados.includes(key))) return -2
        if (Object.values(update).some((value) => value.length === 0)) return -3
        if ((keys.includes('title') && !isNaN(update.title)) || (keys.includes('description') && !isNaN(update.description)) || (keys.includes('category') && !isNaN(update.category))) {
            return -5
        }
        if (keys.includes('thumbnails') && !Array.isArray(update.thumbnails)) return -6
        try {
            const product = await productModel.updateOne({ _id: { $eq: id } }, update)
            if (!product.matchedCount) return -4
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -4
            else if (error.code === 11000) return -7
            else return { message: error.message, error: error.name }
        }
        return 1
    }
    async deleteProduct(id) {
        try {
            const product = await productModel.deleteOne({ _id: id })
            if (!product.deletedCount) return -4
        } catch (error) {
            if (error.reason.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -4
            else return { message: error.message, error: error.name }
        }
        return 1
    }
}
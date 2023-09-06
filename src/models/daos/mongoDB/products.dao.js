import { productModel } from "../../schemas/product.schema.js"

export default class ProductDAO {
  
    async addProduct(product) {
        try {
            await productModel.create(product)
        } catch (error) {
            if (error.code === 11000) return -7
            else return { message: error.message, error: error.name }
        }
        return 1
    }
    async getProducts(filter, options) {
        try {
            const products = await productModel.paginate(
                filter, 
                options
            )
            return products
        } catch (error) {
            if (error.name === "CastError") return -8
            else return { message: error.message, error: error.name }
        }
    }
    async getProductById(id) {
        try {
            const product = await productModel.findOne({ _id: id }).lean()
            if (!product) return -4
            return product
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -4
            else return { message: error.message, error: error.name }
        }
        
    }
    async updateProduct(id, update) {
        try {
            const product = await productModel.updateOne({ _id: { $eq: id } }, update)
            if (!product.matchedCount) return -4
            return 1
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -4
            else if (error.code === 11000) return -7
            else return { message: error.message, error: error.name }
        }
    }
    async deleteProduct(id) {
        try {
            const product = await productModel.deleteOne({ _id: id })
            if (!product.deletedCount) return -4
            return 1
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -4
            else return { message: error.message, error: error.name }
        }
    }
}
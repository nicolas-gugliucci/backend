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
    async getProducts(limit, page, sort, query, currentUrl) {
        let products
        let filter = {}
        if (query && (query === "true") || (query === "false")) filter = { status: query }
        else if (query) filter = { category: query }
        try {
            products = await productModel.paginate(
                filter, //confirmar que sea esto lo requerido
                {
                    limit: limit ? limit : 10,
                    sort: sort ? { price: sort } : {},
                    page: page ? page : 1,
                    lean: true
                }
            )
        } catch (error) {
            if (error.name === "CastError") return -8 //revisar
            else return { message: error.message, error: error.name }
        }
        let nextLink = null
        let prevLink = null
        if (products.hasNextPage) {
            if (currentUrl?.includes('page')) {
                const index = currentUrl.indexOf('page') + 5
                nextLink = currentUrl.replace(`page=${currentUrl[index]}`, `page=${products.nextPage}`)
            } else if (currentUrl?.includes('?')) nextLink = `${currentUrl}&page=${products.nextPage}`
            else nextLink = `${currentUrl}?page=${products.nextPage}`
        }
        if (products.hasPrevPage) {
            if (currentUrl?.includes('page')) {
                const index = currentUrl.indexOf('page') + 5
                prevLink = currentUrl.replace(`page=${currentUrl[index]}`, `page=${products.prevPage}`)
            } else if (currentUrl?.includes('?')) prevLink = `${currentUrl}&page=${products.prevPage}`
            else prevLink = `${currentUrl}?page=${products.prevPage}`
        }
        products = {
            prevLink: prevLink,
            nextLink: nextLink,
            ...products
        }
        products.payload = products.docs
        delete products.docs
        delete products.totalDocs
        delete products.limit
        delete products.pagingCounter
        return products
    }
    async getProductById(id) {
        let product
        try {
            product = await productModel.findOne({ _id: id }).lean()
            if (!product) return -4
        } catch (error) {
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -4
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
            if (error.reason?.message === 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer') return -4
            else return { message: error.message, error: error.name }
        }
        return 1
    }
}
import ProductDAO from "../models/daos/mongoDB/products.dao.js"

const dao = new ProductDAO()

export default class ProductService{
    async addProduct(product, files) {
        if (files) {
            if (files.length !== 0) {
                let thumbnails = files.map(file => file.path)
                thumbnails = thumbnails.map(e => e.slice(60, undefined))
                product = { ...product, thumbnails }
            }
        }
        const { title, description, code, price, stock, category, thumbnails } = product
        if (arguments.length != 2) return -1
        const aceptados = ["title", "description", "code", "price", "stock", "category", "thumbnails"]
        if (Object.keys(product).some((key) => !aceptados.includes(key))) return -2
        if (Object.values(product).some((value) => value.length === 0)) return -3
        if (!isNaN(title) || !isNaN(description) || !isNaN(category)) return -5
        if (thumbnails && !Array.isArray(thumbnails)) return -6
        const result = await dao.addProduct(product)
        return result
    }
    async getProducts(limit, page, sort, query, currentUrl) {
        let products
        let filter = {}
        if (query && (query === "true") || (query === "false")) filter = { status: query }
        else if (query) filter = { category: query }
        const options = 
            { 
                limit: limit ? limit : 10,
                sort: sort ? { price: sort } : {},
                page: page ? page : 1,
                lean: true
            }
        products = await dao.getProducts(filter, options)
        if (!products?.hasNextPage) return products
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
        const product = await dao.getProductById(id)
        return product
    }
    async updateProduct(id, update, files) {
        if (files) {
            if (files.length !== 0) {
                let thumbnails = files.map(file => file.path)
                thumbnails = thumbnails.map(e => e.slice(60, undefined))
                update = { ...update, thumbnails }
            }
        }
        if (update.length === 0) return -5
        const aceptados = ["title", "description", "code", "price", "stock", "category", "thumbnails", "status"]
        const keys = Object.keys(update)
        if (keys.some((key) => !aceptados.includes(key))) return -2
        if (Object.values(update).some((value) => value.length === 0)) return -3
        if ((keys.includes('title') && !isNaN(update.title)) || (keys.includes('description') && !isNaN(update.description)) || (keys.includes('category') && !isNaN(update.category))) {
            return -5
        }
        if (keys.includes('thumbnails') && !Array.isArray(update.thumbnails)) return -6
        const result = await dao.updateProduct(id, update)
        return result
    }
    async deleteProduct(id) {
        const result = await dao.deleteProduct(id)
        return result
    }
}
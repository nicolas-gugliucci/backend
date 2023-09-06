import fs from 'fs'

export default class ProductManager {
    constructor() {
        this.path = "../data/Products.JSON"
    }

    async addProduct({ title, description, code, price, stock, category, thumbnails }) {
        let id = null
        let products = null
        if (arguments.length != 1) {
            return -1 //"Only an object is expected"
        }
        const aceptados = ["title", "description", "code", "price", "stock", "category"]
        const aceptados2 = ["title", "description", "code", "price", "stock", "category", "thumbnails"]
        const pasados = Object.keys(arguments[0])
        if (aceptados.sort().join(',') !== pasados.sort().join(',') && aceptados2.sort().join(',') !== pasados.sort().join(',')) {
            return -2 //"Five or six parameters expected" "Your product must have the folowings camps:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-Thumbnails <--(opcional)"
        } else if (Object.values(arguments[0]).some((argument) => argument.length === 0)) {
            return -3 //"All parameters must include relevant information"
        }
        if (!isNaN(title) || !isNaN(description) || !isNaN(code) || isNaN(price) || isNaN(stock) || !isNaN(category) || (thumbnails && !Array.isArray(thumbnails))) {
            return -5 //"Your propeties must have the folowings types:\n-Title <-- String\n-Description <-- String\n-Code <-- String\n-Price <-- Number\n-Stock <-- Number\n-Category <-- String\n-Thumbnails <-- array"
        }
        if (fs.existsSync(this.path)) {
            products = await this.getProducts()
            if (products.some((product) => product.code === code)) {
                return -4 //"This code has already been used"
            } else {
                id = products[products.length - 1].id + 1
            }
        } else {
            id = 1
            products = []
        }

        let product = {
            id: id,
            title: title,
            description: description,
            code: code,
            price: Number(price),
            status: true,
            stock: Number(stock),
            category: category
        }
        if (thumbnails) product = { ...product, thumbnails }
        products.push(product)
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        }
        catch (error) {
            return error
        }
    }
    async getProducts() {
        return fs.existsSync(this.path)
            ? JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            : []
    }
    async getProductById(id) {
        let products = await this.getProducts()
        let product = products.find((prod) => prod.id === Number(id))
        if (!product) {
            return -1
        } else {
            return product
        }
    }
    async updateProduct(id, update) {
        let product = await this.getProductById(id)
        if (product === -1) return -1
        if (update.length === 0) return -5
        const keys = Object.keys(update)
        if ((keys.title && !isNaN(update.title)) || (keys.includes('description') && !isNaN(update.description)) || (keys.includes('status') && !(update.status === 'false' || update.status === 'true')) && update.status.length !== 0 || (keys.includes('code') && !isNaN(update.code)) || (keys.includes('price') && isNaN(update.price)) && update.price.length !== 0 || (keys.includes('stock') && isNaN(update.stock)) && update.stock.length !== 0 || (keys.includes('category') && !isNaN(update.category)) || (keys.includes('thumbnails') && !Array.isArray(update.thumbnails))) {
            return -4//"Your propeties must have the folowings types:\n-Title <-- String\n-Description <-- String\n-Status <-- Boolean\n-Code <-- String\n-Price <-- Number\n-Stock <-- Number\n-Category <-- String\n-Thumbnails <-- array"
        }
        update?.status === "true"
            ? update.status = true
            : update.status = false
        if (update.price) update.price = Number(update.price)
        if (update.stock) update.stock = Number(update.stock)
        const values = Object.values(update)
        const aceptados = ["title", "description", "code", "price", "stock", "category", "thumbnails", "status"]
        let products = await this.getProducts()
        const productIndex = products.map(object => object.id).indexOf(product.id)
        for (let i = 0; i < values.length; i++) {
            if (aceptados.indexOf(keys[i]) === -1) return -2
            if (values[i].length === 0) return -3
            products[productIndex][keys[i]] = values[i]
        }
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        }
        catch (error) {
            return error
        }
    }
    async deleteProduct(id) {
        let products = await this.getProducts()
        if (products.some((prod) => prod.id === Number(id))) {
            products.splice(products.map(object => object.id).indexOf(Number(id)), 1)
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
            }
            catch (error) {
                return error
            }
        } else {
            return -1 //`No product found with ID=${id}`
        }
    }
}
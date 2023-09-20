import ProductService from '../services/product.service.js'
import { sendMessage } from '../utils/socket-io.js'
import { errors } from '../utils/errors/errorResponse.js'

const service = new ProductService()

class productController{
    async getAll (req, res) {
        const limit = req.query.limit
        const page = req.query.page
        const sort = req.query.sort
        const query = req.query.query
        const currentUrl = `http://localhost:8080${req.originalUrl}`
        let products = await service.getProducts(limit, page, sort, query, currentUrl)
        if (products === -8 || products?.error) errors(req, res, products)
        else res.send({
            status: 'success',
            ...products
        })
    }

    async getproduct (req, res) {
        const id = req.params.pid
        const productRequested = await service.getProductById(id)
        if (productRequested === -4 || productRequested?.error) errors(req, res, productRequested, id)
        else res.send({
            status: 'success',
            payload: productRequested
        })
    }

    async createProduct (req, res) {
        let product = req.body
        let files = req.files
        const result = await service.addProduct(product, files)
        if (result === 1) {
            const products = await service.getProducts()
            sendMessage('lista_actualizada', products)
            res.send({
                status: 'Success',
                message: 'Product added'
            })
        } else errors(req, res, result, null, null, product.code)
    }

    async updateOneProduct (req, res) {
        if (Object.keys(req.body).length === 0) return errors(res, -9)
        const id = req.params.pid
        const newData = req.body
        const files = req.files
        const result = await service.updateProduct(id, newData, files)
        if (result === 1) {
            const products = await service.getProducts()
            sendMessage('lista_actualizada', products)
            res.send({
                status: 'Success',
                message: 'Product updated'
            })
        } else errors(req, res, result, id, null, newData.code)
    }

    async deleteProduct (req, res) {
        const id = req.params.pid
        const result = await service.deleteProduct(id)
        if (result === 1) {
            const products = await service.getProducts()
            sendMessage('lista_actualizada', products)
            res.send({
                status: 'Success',
                message: 'Product deleted'
            })
        } else errors(req, res, result, id)
    }
}

const controller = new productController()
const {
    getAll,
    getproduct,
    createProduct,
    updateOneProduct,
    deleteProduct
} = controller

export {
    getAll,
    getproduct,
    createProduct,
    updateOneProduct,
    deleteProduct
}
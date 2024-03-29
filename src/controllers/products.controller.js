import ProductService from '../services/product.service.js'
import { sendMessage } from '../utils/socket-io.js'
import { errors } from '../utils/errors/errorResponse.js'
import { MAIL, PORT_ENV, transport } from '../config/config.js'
import UserService from '../services/user.service.js'

const service = new ProductService()
const userService = new UserService()

class productController{
    async getAll (req, res) {
        const limit = req.query.limit
        const page = req.query.page
        const sort = req.query.sort
        const query = req.query.query
        
        const protocolo = req.protocol;
        const host = req.get('host');
        const ruta = req.originalUrl;
        const currentUrl = `${protocolo}://${host}${ruta}`;

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
        
        if (req.session?.user?.role==='premium') product = {...product, owner: req.session.user.email}

        const result = await service.addProduct(product, files)
        if (result?.error === 1) {
            const products = await service.getProducts()
            sendMessage('lista_actualizada', products)
            res.send({
                status: 'Success',
                message: 'Product added',
                payload: result.product
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
        const emailOwner = (await service.getProductById(id)).owner
        if (req.session?.user?.role === 'premium' && req.session.user.email !== emailOwner) return errors(req, res, -18)
        const product = await service.getProductById(id)
        const result = await service.deleteProduct(id)
        if (result === 1) {
            const products = await service.getProducts()
            sendMessage('lista_actualizada', products)
            if(emailOwner != 'admin'){
                const mailParams = {
                    from : `${MAIL}`,
                    to : `${emailOwner}`,
                    subject : 'Product info',
                    html : 
                        `<div style="text-align: center;">
                            <h1>The following product has been deleted:</h1>
                            <h2>${product.title}</h2>
                            <p>${product.description}</p>
                            ${product.thumbnails.map(image => `<img src="${image}">`).join('')}
                        </div>`,
                }
                const reslut = await transport.sendMail(mailParams)
            }
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
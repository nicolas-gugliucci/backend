import { Router } from 'express'
import { uploader } from '../utils/utils.js'
import productManager from '../dao/dbManagers/products.js'
import { sendMessage } from '../utils/socket-io.js'

const manager = new productManager()
const router = Router()

router.get('/', async (req, res) => {
    const limit = req.query.limit
    const page = req.query.page
    const sort = req.query.sort
    const query = req.query.query
    const currentUrl = `http://localhost:8080${req.originalUrl}`
    let products = await manager.getProducts(limit, page, sort, query, currentUrl)
    if (products === -8 || products?.error) errors(res, products)
    else res.send({
        status: 'success',
        ...products
    })
})

router.get('/:pid', async (req, res) => {
    const id = req.params.pid
    const productRequested = await manager.getProductById(id)
    if (productRequested === -4 || productRequested?.error) errors(res, productRequested, id)
    else res.send({
        status: 'success',
        payload: productRequested
    })
})

router.post('/', uploader.array('thumbnails'), async function (req, res) {
    let product = req.body
    if (req.files) {
        if (req.files.length !== 0) {
            let thumbnails = req.files.map(file => file.path)
            thumbnails = thumbnails.map(e => e.slice(60, undefined))
            product = { ...product, thumbnails }
        }
    }
    const result = await manager.addProduct(product)
    if (result === 1) {
        const products = await manager.getProducts()
        sendMessage('lista_actualizada', products)
        res.send({
            status: 'Success',
            message: 'Product added'
        })
    } else errors(res, result, null, product.code)
})

router.put('/:pid', uploader.array('thumbnails'), async function (req, res) {
    if (Object.keys(req.body).length === 0) return errors(res, -9)
    const id = req.params.pid
    let newData = req.body
    if (req.files) {
        if (req.files.length !== 0) {
            let thumbnails = req.files.map(file => file.path)
            thumbnails = thumbnails.map(e => e.slice(60, undefined))
            newData = { ...newData, thumbnails }
        }
    }
    const result = await manager.updateProduct(id, newData)
    if (result === 1) {
        const products = await manager.getProducts()
        sendMessage('lista_actualizada', products)
        res.send({
            status: 'Success',
            message: 'Product updated'
        })
    } else errors(res, result, id, newData.code)
})

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid
    const result = await manager.deleteProduct(id)
    if (result === 1) {
        const products = await manager.getProducts()
        sendMessage('lista_actualizada', products)
        res.send({
            status: 'Success',
            message: 'Product deleted'
        })
    } else errors(res, result, id)
})

const errors = (res, result, id, code) => {
    switch (result) {
        case -1:
            res.status(400).send({
                status: "Error",
                error: "Too many arguments",
                message: 'Only one object is expected'
            })
            break;
        case -2:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: 'You are giving a property that is not included in following list:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-Status\n-Thumbnails'
            })
            break;
        case -3:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: 'All parameters must include relevant information'
            })
            break;
        case -4:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `There is no product with ID "${id}"`
            })
            break;
        case -5:
            res.status(400).send({
                status: "Error",
                error: "Invalid type",
                message: 'Some of the folowing camps are not in string format: \n-Title\n-Description\n-Category'
            })
            break;
        case -6:
            res.status(400).send({
                status: "Error",
                error: "Invalid type",
                message: 'The camp "Thumbnails" must be in array format'
            })
            break;
        case -7:
            res.status(400).send({
                status: "Error",
                error: "Repeted code",
                message: `The code "${code}" has already been used`
            })
            break;
        case -8:
            res.status(400).send({
                status: "Error",
                error: "invalid query",
                message: `The "limit" query is not a number`
            })
            break;
        case -9:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: 'You must update at least one property'
            })
            break;
        default:
            const { error, message } = result
            res.status(400).send({
                status: "Error",
                error: error,
                message: message
            })
            break;
    }
}

export default router
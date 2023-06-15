import { Router } from 'express'
import { uploader } from '../utils/utils.js'
import productManager from '../controllers/ProductManager.js'

const manager = new productManager()
const router = Router()

router.get('/', async (req, res) => {
    let limit = req.query.limit
    const products = await manager.getProducts()
    if (!limit || isNaN(limit)) return res.send(products)
    let productsLimited = products.slice(0, Number(limit))
    res.send({
        status: 'success',
        payload: productsLimited
    })
})

router.get('/:pid', async (req, res) => {
    let id = req.params.pid
    let productRequested = await manager.getProductById(id)
    if (productRequested === -1 || isNaN(id)) return res.status(404).send({
        status: "Error",
        error: "Not found",
        message: `There is no product with ID ${id}`
    })
    res.send({
        status: 'success',
        payload: productRequested
    })
})

router.post('/', uploader.array('thumbnails'), async function (req, res) {
    let product = req.body

    if (req.files.length !== 0) {
        const thumbnails = req.files.map(file => file.path)
        product = { ...product, thumbnails }
    }

    const error = await manager.addProduct(product)
    switch (error) {
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
                message: 'Your product must have the following camps:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-status\n-Thumbnails <--(optional)'
            })
            break;
        case -3:
            res.status(411).send({
                status: "Error",
                error: "Invalid structure",
                message: 'All parameters must include relevant information'
            })
            break;
        case -4:
            res.status(400).send({
                status: "Error",
                error: "Repeted code",
                message: `The code: ${product.code} has already been used`
            })
            break;
        case -5:
            res.status(400).send({
                status: "Error",
                error: "Invalid type",
                message: 'Your properties must have the folowings types:\n-Title <-- String\n-Description <-- String\n-Code <-- String\n-Price <-- Number\n-Stock <-- Number\n-Category <-- String\n-Thumbnails <-- Array'
            })
            break;
        case undefined:
            res.send({
                status: 'Success',
                message: 'Product added'
            })
            break;
        default:
            res.status(417).send({
                status: "Error",
                error: "Writting error",
                message: error
            })
            break;
    }
})

router.put('/:pid', uploader.array('thumbnails'), async function (req, res) {
    if (Object.keys(req.body).length === 0) res.status(400).send({
        status: "Error",
        error: "Invalid structure",
        message: 'You must update at least one property'
    })
    const id = req.params.pid
    let newData = req.body
    if (req.files.length !== 0) {
        const thumbnails = req.files.map(file => file.path)
        newData = { ...newData, thumbnails }
    }
    const error = await manager.updateProduct(id, newData)
    switch (error) {
        case -1:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `There is no product with ID ${id}`
            })
            break;
        case -2:
            res.status(400).send({
                status: "Error",
                error: "Invalid structure",
                message: 'You are trying to change a property that is not included in following list:\n-Title\n-Description\n-Code\n-Price\n-Stock\n-Category\n-Status\n-Thumbnails'
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
            res.status(400).send({
                status: "Error",
                error: "Invalid type",
                message: 'Your properties must have the folowings types:\n-Title <-- String\n-Description <-- String\n-Status <-- Boolean\n-Code <-- String\n-Price <-- Number\n-Stock <-- Number\n-Category <-- String\n-Thumbnails <-- Array'
            })
            break;
        case undefined:
            res.send({
                status: 'Success',
                message: 'Product updated'
            })
            break;
        default:
            res.status(417).send({
                status: "Error",
                error: "Writting error",
                message: error
            })
            break;
    }
})

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid
    const error = await manager.deleteProduct(id)
    switch (error) {
        case -1:
            res.status(404).send({
                status: "Error",
                error: "Not found",
                message: `There is no product with ID ${id}`
            })
            break;
        case undefined:
            res.send({
                status: 'Success',
                message: 'Product deleted'
            })
            break;
        default:
            res.status(417).send({
                status: "Error",
                error: "Writting error",
                message: error
            })
            break;
    }
})

export default router
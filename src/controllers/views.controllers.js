import ProductService from '../services/product.service.js'
import CartService from '../services/cart.service.js'
import { mockProducts } from '../utils/mocks.utils.js'
import { PORT_ENV } from '../config/config.js'

const manager = new ProductService()
const cartsManager = new CartService()

class viewsController {
    async home (req, res) {
        //if (!req.session?.user) return res.redirect(`http://localhost:${PORT_ENV}/login`)
        const limit = req.query.limit
        const page = req.query.page
        const sort = req.query.sort
        const query = req.query.query
        const currentUrl = `http://localhost:${PORT_ENV}${req.originalUrl}`
        let products = await manager.getProducts(limit, page, sort, query, currentUrl)
        res.render('home', {
            style: 'index.css',
            products: products.payload,
            prevLink: products.prevLink,
            nextLink: products.nextLink
        })
    }
    
    async realTimeProducts (req, res) {
        const limit = req.query.limit
        const page = req.query.page
        const sort = req.query.sort
        const query = req.query.query
        const currentUrl = `http://localhost:${PORT_ENV}${req.originalUrl}`
        let products = await manager.getProducts(limit, page, sort, query, currentUrl)
        res.render('realTimeProducts', {
            style: 'index.css',
            products: products.payload,
        })
    }
    
    chat (req, res) {
        res.render('chat', {})
    }
    
    async products (req, res) {
        if (!req.session?.user) return res.redirect('/login')
        const limit = req.query.limit
        const page = req.query.page
        const sort = req.query.sort
        const query = req.query.query
        
        const protocolo = req.protocol;

        // Obtén el nombre de host
        const host = req.get('host');
      
        // Obtén la ruta específica de la solicitud
        const ruta = req.originalUrl;
      
        // Combina el protocolo, el nombre de host y la ruta para obtener la ruta completa
        const currentUrl = `${protocolo}://${host}${ruta}`;
        //const currentUrl = window.location.href
        let products = await manager.getProducts(limit, page, sort, query, currentUrl)
        res.render('products', {
            style: 'index.css',
            products: products.payload,
            prevLink: products.prevLink,
            nextLink: products.nextLink,
            user: req.session.user
        })
    }
    
    async cart (req, res) {
        if (!req.session?.user) return res.redirect('/login')
        const id = req.params.cid
        const productsInCart = await cartsManager.getCartById(id, true)
        res.render('cart', {
            style: 'index.css',
            products: productsInCart.products
        })
    }
    
    register (req, res) {
        res.render('register')
    }
    
    login (req, res) {
        res.render('login')
    }
    
    profile (req, res) {
        if (!req.session?.user) return res.redirect('/login')
        res.render('profile',{
            user: req.session?.user
        })
    }

    mockingproducts (req, res) {
        const products = Array.from({length:100}, () => mockProducts())
        res.json({success:true, payload:products})
    }

    resetPassword (req, res) {
        res.render('resetPassword')
    }

    startResetPassword (req, res) {
        res.render('startResetPassword')
    }

    info (req, res) {
        res.render('info')
    }
}

const controller = new viewsController()

const {
    home,
    realTimeProducts,
    chat,
    products,
    cart,
    register,
    login,
    profile,
    mockingproducts,
    resetPassword,
    startResetPassword,
    info
} = controller

export {
    home,
    realTimeProducts,
    chat,
    products,
    cart,
    register,
    login,
    profile,
    mockingproducts,
    resetPassword,
    startResetPassword,
    info
}
import Router from 'express';
import productsRouter from './api/products.routes.js';
import cartsRouter from './api/carts.routes.js'
import realtimeproductsRouter from './realTimeProducts.routes.js'
import productDetailRouter from './productDetail.routes.js'
import productModel from "../models/products.models.js";
import cartsModel from "../models/carts.models.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const {
            limit = 10, numPage = 1, category, sort
        } = req.query;

        let filter = {};
        if (category) {
            filter.category = category;
        }

        let sortOptions = {};
        if (sort === 'asc') {
            sortOptions.price = 1;
        } else if (sort === 'desc') {
            sortOptions.price = -1;
        }

        const {
            docs,
            page,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        } = await productModel.paginate(filter, {
            limit,
            lean: true,
            page: numPage,
            sort: sortOptions
        });

        res.render('home', {
            title: 'Home',
            products: docs,
            hasNextPage,
            hasPrevPage,
            totalPages,
            prevPage,
            nextPage,
            page
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/products', async (req, res) => {
    const {
        limit = 10, numPage = 1
    } = req.query;
    const {
        docs,
        page,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    } = await productModel.paginate({}, {
        limit,
        lean: true,
        page: numPage
    });
    res.render('products', {
        title: 'Products',
        products: docs,
        hasNextPage,
        hasPrevPage,
        totalPages,
        prevPage,
        nextPage,
        page
    });
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const {
        cid
        } = req.params;
        const cart = await cartsModel.findById(cid).populate("products.product").lean();
        if (!cart) {
            return res.status(404).json({
            status: "error",
            message: "Carrito no encontrado"
            });
        }

        const cartTotal = cart.products.reduce((total, item) => {
        if (item.product && item.product.price) {
            return total + item.quantity * item.product.price;
        }
        return total;
        }, 0);

        res.render("carts", {
            cart,
            cartTotal
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    const {
        limit = 10, numPage = 1
    } = req.query;
    try {
        const {
            docs,
            page,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        } = await productModel.paginate({}, {
            limit,
            page: numPage,
            lean: true
        });

        res.render('realTimeProducts', {
            products: docs,
            hasPrevPage,
            hasNextPage,
            totalPages,
            prevPage,
            nextPage,
            page
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/realtimeproducts/:id/edit', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).populate('category');
        const {
            limit = 6, numPage = 1
        } = req.query;
        const {
            docs,
            page,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        } = await productModel.paginate({}, {
            limit,
            page: numPage,
            lean: true
        });

        res.render('realTimeProducts', {
            products: docs,
            productToEdit: product,
            hasPrevPage,
            hasNextPage,
            totalPages,
            prevPage,
            nextPage,
            page
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/product/:pid', async (req, res) => {
    try {
        const {
            pid
        } = req.params;
        const product = await productModel.findById(pid).lean();
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('productDetail', {
            title: 'Detalle del Producto',
            product
        });
    } catch (error) {
        res.status(500).send('Error al obtener el producto');
    }
});

router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);
router.use('/realtimeproducts', realtimeproductsRouter);
router.use('/productdetail', productDetailRouter);

export default router;
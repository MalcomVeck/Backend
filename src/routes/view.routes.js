import { Router } from "express";
import managerProducts from "../managers/managerProducts.js";

const router = Router();
const productsManager = new managerProducts();

router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.render('home', { title: 'Home', products });
    } catch (error) {
        console.error('Lo sentimos. Hubo un error al cargar los Productos.', error);
        res.status(500).send({status: 'error', message: 'Error al cargar los Productos.'})
    }
})

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.render('realtimeproducts', { title: 'Productos en Tiempo Real', products });
    } catch (error) {
        console.error('Lo sentimos. Hubo un error al cargar los Productos.', error);
        res.status(500).send({status: 'error', message: 'Error al cargar los Productos.'});
    }
})

export default router;
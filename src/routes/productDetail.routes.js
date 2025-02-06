import Router from 'express';
import productModel from '../models/products.models.js';

const router = Router();

router.get('/product/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('productDetail', {
            product
        });
    } catch (error) {
        res.status(500).send('Error al obtener el producto');
    }
});

export default router;
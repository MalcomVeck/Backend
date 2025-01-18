import { Router } from 'express';
import fs from 'fs/promises';
import ManagerCart from '../../managers/ManagerCart.js';

const cartRoutes = Router();
const cartManager = new ManagerCart('src/db/cart.json');

cartRoutes.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al crear el carrito.', error: error.message });
    }
});

cartRoutes.get('/carts', async (req, res) => {
    try {
        const carts = await cartManager.readCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener los carritos.', error: error.message });
    }
});

cartRoutes.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const productData = await fs.readFile('src/db/products.json', 'utf-8');
        const products = JSON.parse(productData);
        const product = products.find(p => p.id === Number(pid));

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
        }

        const updatedCart = await cartManager.addProductToCart(cid, product);
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: `Carrito con ID '${cid}' no encontrado.` });
        }
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al agregar el producto al carrito.', error: error.message });
    }
});

cartRoutes.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: `Carrito con ID '${cid}' no encontrado.` });
        }
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener los productos del carrito.', error: error.message });
    }
});

cartRoutes.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const isDeleted = await cartManager.deleteCart(cid);
        if (!isDeleted) {
            return res.status(404).json({ status: 'error', message: `Carrito con ID '${cid}' no encontrado.` });
        }
        res.json({ status: 'ok', message: 'Carrito eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al eliminar el carrito.', error: error.message });
    }
});

export default cartRoutes;
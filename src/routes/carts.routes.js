import { Router } from "express";
import fs from 'fs';

const cartRoutes = Router();

const getProducts = async () => {
    try {
        const products = await fs.promises.readFile('src/db/cart.json', 'utf-8');
        const productsConverted = JSON.parse(products);
        return productsConverted;
    } catch (error) {
        return [];
    }
}

const saveCart = async (products) => {
    try {
        const parsedProducts= JSON.stringify(products);
        await fs.promises.writeFile('src/db/cart.json', parsedProducts, 'utf-8');
        return true;
    } catch (error) {
        return false;
    }
}

const getSingleProductById = async (pId) => {
    const products = await getProducts();
    const product = products.find(p => p.id === pId);
    return product;
}

cartRoutes.get('/:cid', async (req, res) => {
    const pId = +req.params.cid;
    const product = await getSingleProductById(pId);
    if (!product){
        return res.status(404).send({status: 'Error', message: 'Product not found'});
    }
    res.send({product});
});

cartRoutes.post('/', async (req, res) => {
    const carrito = req.body;
    carrito.id = Math.floor(Math.random() * 1000);
    const products = await getProducts();
    products.push(carrito);
    const isOk = await saveCart(products);
    if (!isOk){
        return res.send({status: 'Error', message: 'Product could not add'});
    }
    res.send({status: 'Ok', message: 'Product added'});
});

cartRoutes.post('/:cid/product/:pid', async (req, res) => {
    const newProduct = req.body;
    const products = await getProducts();
    products.push(newProduct.id || newProduct.quantity++);
    const isOk = await saveCart(products);
    if (!isOk){
        return res.send({status: 'Error', message: 'Product could not add'});
    }
    res.send({status: 'Ok', message: 'Product added'});
});

export default cartRoutes;
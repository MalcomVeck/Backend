import { Router } from "express";
import fs from 'fs';

const productsRoutes = Router();

const getProducts = async () => {
    try {
        const products = await fs.promises.readFile('src/db/products.json', 'utf-8');
        const productsConverted = JSON.parse(products);
        return productsConverted;
    } catch (error) {
        return [];
    }
}

const saveProducts = async (products) => {
    try {
        const parsedProducts= JSON.stringify(products);
        await fs.promises.writeFile('src/db/products.json', parsedProducts, 'utf-8');
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

productsRoutes.get('/', async (req, res) => {
    const limit = +req.query.limit;
    const products = await getProducts();
    if(isNaN(limit) || !limit){
        return res.send({products});
    }
    const productsLimited = products.slice(0, limit);
    res.send({products: productsLimited});
});

productsRoutes.get('/:pid', async (req, res) => {
    const pId = +req.params.pid;
    const product = await getSingleProductById(pId);
    if (!product){
        return res.status(404).send({status: 'Error', message: 'Product not found'});
    }
    res.send({product});
});

productsRoutes.post('/', async (req, res) => {
    const product = req.body;
    product.id = Math.floor(Math.random() * 1000);
    if(!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category){
        return res.status(400).send({status: 'Error', message: 'Produc Incompleted'});
    }
    const products = await getProducts();
    products.push(product);
    const isOk = await saveProducts(products);
    if (!isOk){
        return res.send({status: 'Error', message: 'Product could not add'});
    }
    res.send({status: 'Ok', message: 'Product added'});
});

productsRoutes.delete('/:pid', async (req, res) => {
    const id = +req.params.pid;
    const product = await getSingleProductById(id);
    if (!product){
        return res.status(404).send({status: 'Error', message: 'Product not found'});
    }
    const products = await getProducts();
    const filterProducts = products.filter(p => p.id !== id);
    const isOk = await saveProducts(filterProducts);
    if (!isOk){
        return res.status(400).send({status: 'Error', message: 'Something went wrong'});
    }
    res.send({status: 'Ok', message: 'Product deleted'});
});

productsRoutes.put('/:pid', async (req, res) => {
    const pId = +req.params.pid;
    const productToUpdated = req.body;
    const products = await getProducts();
    let product = products.find(p => p.id === pId); 
    if(!productToUpdated.title || !productToUpdated.description || !productToUpdated.code || !productToUpdated.price || !productToUpdated.status || !productToUpdated.stock || !productToUpdated.category){
        return res.status(400).send({status: 'Error', message: 'Produc Incompleted'});
    }
    const updatedProducts = products.map(p=> {
        if(p.id === pId){
            return {
                ...productToUpdated,
                id: pId
            }
        }
        return p;
    })
    const isOk = await saveProducts(updatedProducts);
    if (!isOk){
        return res.status(400).send({status: 'Error', message: 'Something went wrong'});
    }
    res.send({status: 'Ok', message: 'Product Updated'});
});

export default productsRoutes;
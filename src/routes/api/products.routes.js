import { Router } from "express";
import managerProducts from '../../managers/managerProducts.js'

const productsRoutes = Router();
const productsManager = new managerProducts();

productsRoutes.get('/', async (req, res) => {
    const limit = +req.query.limit;
    const productsList = await productsManager.getProducts();
    if(isNaN(limit) || !limit){
        return res.send({productsList});
    }
    const productsListLimited = productsList.slice(0, limit)
    res.send({productsList: productsListLimited});
})

productsRoutes.get('/:pid', async (req, res) => {
    const pId = +req.params.pid;
    const product = await productsManager.getSingleProductsById(pId);
    if(!product){
        return res.status(404).send({status: 'error', message: `Lo sentimos. No se encuentra el producto con ID: ${pId}.`});
    }
    res.send({product});
})

productsRoutes.post('/', async (req, res) => {
    try {
        const product = req.body;

        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnail'];
        const missingFields = requiredFields.filter(field => !product[field]);
        if(missingFields.length > 0){
            return res.status(400).send({status: 'error', message: `Falta completar algunos campos obligatorios: '${missingFields.join(', ')}'`})
        }

        if(typeof  product.status === 'undefined'){
            product.status = true;
        } else if (typeof product.status !== 'boolean'){
            return res.status(400).send({status: 'error', message: 'El campo "Status" debe ser True o False.'});
        }

        product.id = Math.floor(Math.random() * 10000);

        const products = await productsManager.getProducts();
        products.push(product);

        const isOK = await productsManager.saveProducts(products);
        if(!isOK){
            return res.status(500).send({status: 'error', message: 'El producto no pudo ser añadido.'});
        }
        return res.status(200).send({status: 'success', message: 'El producto fue añadido con éxito!', product});

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 'error', message: 'Ocurrio un error.'})
    }
})

productsRoutes.put('/:pid', async (req, res) => {
    const pId = +req.params.pid;
    const productToUpdate = req.body;

    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnail'];
    const missingFields = requiredFields.filter(field => !productToUpdate[field]);

    if (missingFields.length > 0) {
        return res.status(400).send({
            status: 'error',
            message: `Debes completar los siguientes campos: '${missingFields.join(', ')}'.`,
        });
    }

    if (typeof productToUpdate.status === 'undefined') {
        productToUpdate.status = true;
    } else if (typeof productToUpdate.status !== 'boolean') {
        return res.status(400).send({
            status: 'error',
            message: "El campo 'status' debe ser true o false.",
        });
    }

    const products = await productsManager.getProducts();
    const productIndex = products.findIndex(p => p.id === pId);

    if (productIndex === -1) {
        return res.status(404).send({status: 'error', message: 'El producto no existe.'})
    }

    products[productIndex] = {
        ...products[productIndex],
        ...productToUpdate,
        id: pId
    }

    const isOK = await productsManager.saveProducts(products);
    if(!isOK){
        return res.status(500).send({status: 'error', message: 'Hubo un error al guardar el Producto.'});
    }
    res.send({status: 'ok', message: 'El Producto fue actualizado correctamente!'});
})

productsRoutes.delete('/:pid', async (req, res) => {
    const id = +req.params.pid;
    const product = await productsManager.getSingleProductsById(id);
    if (!product){
        return res.status(404).send({status:'error', message: 'El producto no existe.'});
    }
    const products = await productsManager.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    
    const isOk = await productsManager.saveProducts(filteredProducts);
    if(!isOk){
        return res.status(404).send({status: 'error', message: 'Hubo un error al Eliminar el Producto.'});
    }
    res.send({status: 'ok', message: 'El Producto fue Eliminado correctamente!'});
})

export default productsRoutes;
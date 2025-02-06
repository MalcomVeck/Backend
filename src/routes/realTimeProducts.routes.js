import Router from 'express';
import productModel from '../models/products.models.js';

const router = Router();

router.post('/', async (req, res) => {
    const {
        _id,
        title,
        description,
        code,
        price,
        stock,
        category,
        type,
        thumbnail,
        status
    } = req.body;
    if (_id) {
        try {
        await productModel.findByIdAndUpdate(_id, {
            title,
            description,
            code,
            price,
            stock,
            category,
            type,
            thumbnail,
            status
        });
        res.redirect('/realtimeproducts');
        } catch (err) {
        res.status(500).send(err);
        }
    } else {
        const newProduct = new productModel({
            title,
            description,
            code,
            price,
            stock,
            category,
            type,
            thumbnail,
            status: true
        });
        try {
            await newProduct.save();
            res.redirect('/realtimeproducts');
        } catch (err) {
            res.status(500).send(err);
        }
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        res.redirect('/realtimeproducts');
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router
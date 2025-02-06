import Router from 'express';
import cartsModel from '../../models/carts.models.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartsModel.create({
            products: []
        });
        res.send(newCart);
    } catch (error) {
        console.log(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const carts = await cartsModel.find({});
        res.send(carts)
    } catch (error) {
        console.log(error);
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const {
            cid
        } = req.params;
        const cart = await cartsModel.findOne({
            _id: cid
        });
        res.send(cart);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const {
            cid
        } = req.params;
        const deletedCart = await cartsModel.findByIdAndUpdate({
            _id: cid
        }, {
            products: []
        }, {
            new: true
        });
        res.send(deletedCart);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const {
            cid,
            pid
        } = req.params;
        const updatedCart = await cartsModel.findOneAndUpdate({
            _id: cid
        }, {
            $pull: {
                products: {
                    product: pid
                }
            }
        }, {
            new: true
        });

        if (!updatedCart) {
            return res.status(404).json({
                error: "Carrito no encontrado"
            });
        }

        res.json(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al eliminar el producto"
        });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const {
        cid,
        pid
    } = req.params;
    const {
        quantity
    } = req.body;

    try {
        const updatedCart = await cartsModel.findOneAndUpdate({
            _id: cid,
            "products.product": pid
        }, {
            $set: {
                "products.$.quantity": Math.max(1, quantity)
            }
        }, {
            new: true
        });
        if (!updatedCart) return res.status(404).json({
            error: "Carrito o producto no encontrado"
        });
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar la cantidad del producto en el carrito"
        });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    const {
        cid,
        pid
    } = req.params;

    try {
        const cart = await cartsModel.findById(cid);
        if (!cart) return res.status(404).json({
            error: "Carrito no encontrado"
        });

        if (!Array.isArray(cart.products)) {
            cart.products = [];
        }

        const productIndex = cart.products.findIndex(p => p.product && p.product.toString() === pid);
        if (productIndex === -1) {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        await cart.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al agregar el producto al carrito'
        });
    }
});

export default router
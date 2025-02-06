import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        price: Number
    }
});

cartSchema.pre('findOne', function () {
    this.populate('products.product')
});

const cartsModel = model('carts', cartSchema)

export default cartsModel;
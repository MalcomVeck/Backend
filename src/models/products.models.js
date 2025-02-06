import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, "El título del Producto es Obligatorio."],
        trim: true,
        minlength: [4, "El Título debe tener al menos 4 Caracteres."]
    },
    description: {
        type: String,
        required: [true, "La Descripción del Producto es Obligatoria."],
        trim: true
    },
    code: {
        type: String,
        required: [true, "El Código del Producto es Obligatorio."],
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required: [true, "El Precio del Producto es Obligatorio."],
        min: [0, "El Precio del Producto debe ser un Valor Mayor a 0."]
    },
    stock: {
        type: Number,
        required: [true, "El Stock del Producto es Obligatorio."],
        min: [0, "El Stock no puede ser un numero negativo."]
    },
    category: {
        type: String,
        required: [true, "La Categoría del Producto es Obligatoria."],
        trim: true
    },
    type: {
        type: String,
        required: [true, "El Tipo De Producto es Obligatorio."],
        trim: true
    },
    thumbnail: {
        type: String,
        required: [true, "La Imagen del Producto es Obligatoria."],
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

productSchema.plugin(mongoosePaginate)

const productModel = model(productsCollection, productSchema);

export default productModel;
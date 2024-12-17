import express from 'express';
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';

const PORT = 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);

app.listen(PORT, () => {
    console.log(`Escuchando en ${PORT}`)
})
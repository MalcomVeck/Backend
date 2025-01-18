import express from 'express';
import handlebars from 'express-handlebars';
import { Server as HttpServer } from 'http';
import { Server as SocketIo } from 'socket.io';
import managerProducts from './managers/managerProducts.js';

const productsManager = new managerProducts();

import viewsRoutes from './routes/view.routes.js';
import productsRoutes from './routes/api/products.routes.js';
import cartRoutes from './routes/api/cart.routes.js';


const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketIo(httpServer);

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use('/', viewsRoutes)
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');
    
    const products = await productsManager.getProducts();
    socket.emit('products', products);

    socket.on('newProduct', async (product) => {

        if (typeof product.status !== 'boolean') {
            product.status = true;
        }

        const products = await productsManager.getProducts();
        products.push(product);
        await productsManager.saveProducts(products);
        io.emit('products', products);
    });

    socket.on('deleteProduct', async (productId) => {
        const products = await productsManager.getProducts();
        const updatedProducts = products.filter(p => p.id !== productId);
        await productsManager.saveProducts(updatedProducts);
        io.emit('products', updatedProducts);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
import express from 'express';
import handlebars from 'express-handlebars';
import { Server as HttpServer } from 'http';
import { Server as SocketIo } from 'socket.io';
import viewsRouter from './routes/views.routes.js';
import connectDB from './config/index.js';


const app = express();
const PORT = 8080 || process.env.PORT;
const httpServer = new HttpServer(app);
const io = new SocketIo(httpServer);


app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));


const hbsHelper = {
    multiply: (a, b) => a * b,
};
app.engine('hbs', handlebars.engine({
    extname: ".hbs",
    helpers: hbsHelper,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
}));
app.set('view engine', 'hbs');
app.set('views', 'src/views');

app.use('/', viewsRouter);
connectDB()

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchado en el puerto ${PORT}.`);
});

export default app;
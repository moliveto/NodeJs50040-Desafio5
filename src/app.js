import path from 'path';
import express from 'express';
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./class/ProductManager.js";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js"
import routerProductos from './routes/products.js';

const PORT = 3000;
const app = express();

const httpServer = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
httpServer.on('error', () => console.log(`Error: ${err}`));
const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", viewsRouter);
app.use('/products', routerProductos);

const productsFile = "./products.json";
const productManager = new ProductManager(productsFile);
await productManager.readFromFile();
let productos = productManager.getProducts();

io.on('connection', socket => {
    console.log("Nuevo cliente conectado: ", socket.id);

    console.log(productos);
    io.sockets.emit('products', productos);

    socket.on('addProduct', async newProduct => {
        console.log(newProduct);
        const product = await productManager.addProduct(newProduct);
        productos.push(product);

        io.sockets.emit('products', productos);
    })
});
import path from 'path';

// Server 
import express from 'express';
import __dirname from "./utils.js";
const PORT = 3000;
const app = express();

const httpServer = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
httpServer.on('error', () => console.log(`Error: ${err}`));

// Socket
import { Server as IO } from "socket.io";
const io = new IO(httpServer);
io.on('connection', socket => {
    console.log("Nuevo cliente conectado: ", socket.id);

    socket.on('update-products', async () => {
        console.log("inicio update socket")
        const products = await manager.getProducts();
        console.log(products);
        socket.emit('products-data', products);
    });

    socket.on('addProduct', async (newProd) => {
        console.log("inicio add socket")
        const response = await manager.addProduct(newProd)
        console.log(response)
        const products = await manager.getProducts()
        socket.emit('products-data', products)
        socket.emit("status-changed", response)
    })

    socket.on('remove-product', async (code) => {
        console.log("inicio remove socket")
        const result = await manager.deleteProduct(code);
        socket.emit("status-changed", result)
        const products = await manager.getProducts();
        socket.emit('products-data', products);
        console.log("fin remove socket")
    })
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/static", express.static(__dirname + "/public"))
app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/home', express.static(path.join(__dirname, '/public')))

// Handlebars
import handlebars from "express-handlebars";
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    res.render("index", {})
})

// Views
app.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", {})
})

app.get("/home", async (req, res) => {
    const products = await manager.getProducts()
    res.render("home", { ...products })
})

// views
import productRouter from './routes/products.router.js';
import viewsRouter from "./routes/views.router.js"
app.use("/api/products", productRouter);
app.use("/api/realtimeproducts", viewsRouter);

// Products Manager
import ProductManager from "./class/ProductManager.js";
const productsFile = "./products.json";
const manager = new ProductManager(productsFile);
await manager.readFromFile();
import { Router } from "express";

const router = Router();
import ProductManager from "../class/ProductManager.js";
const productsFile = "./products.json";
const manager = new ProductManager(productsFile);
await manager.readFromFile();

router.get("/:pid", async (req, res) => {
    const pid = req.params.pid;
    res.send(await manager.getProductById(parseInt(pid)))

});

router.get("/:limit?", async (req, res) => {
    const limit = parseInt(req.query.limit)
    res.send(await manager.getProducts(limit))

})

router.post("/", async (req, res) => {
    res.send(await manager.addProduct(req.body))
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    res.send(await manager.updateProduct(id, req.body))
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    res.send(await manager.deleteProduct(id))
});

export default router;

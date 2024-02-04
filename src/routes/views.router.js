import { Router } from "express";

const router = Router();

let prods = [];

router.get("/", (req, res) => {
  res.render("realtimeproducts", {})
})

router.post("/", (req, res) => {
  const prodBody = req.body;
  const newProd = {
    ...prodBody, status: true,
  }
  prods.push(newProd)
})

router.delete("/", (req, res) => {
  const prodId = req.body
  console.log(prodId)
  prods = prods.filter(prod => prod.id !== prodId)
})

export default router;
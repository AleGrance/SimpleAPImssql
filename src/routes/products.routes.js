import { Router } from "express";
import { getProduct, postProduct } from "../controllers/products.controller.js";

const router = Router();

router.get("/products", getProduct);

router.post("/products", postProduct);

export default router;

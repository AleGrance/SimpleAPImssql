import { Router } from "express";
import { getContadores, getContadoresByDate } from "../controllers/contadores.controller.js";

const router = Router();

// GET contadores
router.get("/contadores", getContadores);
// GET/POST contadores por fecha
router.post("/contadoresFecha", getContadoresByDate);

export default router;

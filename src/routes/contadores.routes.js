import { Router } from "express";
import { contadoresAcumFiltered, contadoresFiltered, getContadores, getContadoresByDate, getContadoresByDateAcum, getContadoresByDateDet } from "../controllers/contadores.controller.js";

const router = Router();

// GET contadores (tabla contadores)
router.get("/contadores", getContadores);
// GET/POST contadores por fecha todos (tabla contadores)
router.post("/contadoresFecha", getContadoresByDate);

// GET/POST contadores por fecha acumulado (tabla contadores_acum)
router.post("/contadoresFechaAcumulado", getContadoresByDateAcum);
// GET/POST contadores por fecha todos (tabla botes)
router.post("/contadoresFechaDetallado", getContadoresByDateDet);

// PAGINATION (tabla botes)
router.post('/contadoresFiltered', contadoresFiltered);
router.post('/contadoresAcumFiltered', contadoresAcumFiltered);

export default router;

import { Router } from "express";
import { deleteEmbarcacion, embarcacionesFiltered, getEmbarcaciones, getEmbarcacionesActivas, postEmbarcacion, putEmbarcacion } from "../controllers/embarcaciones.controller.js";

const router = Router();

// GET Embarcaciones
router.get("/Embarcaciones", getEmbarcaciones);
// GET Embarcaciones Activas
router.get("/EmbarcacionesActivas", getEmbarcacionesActivas);
// POST Embarcaciones
router.post("/Embarcaciones", postEmbarcacion);
// PUT Embarcaciones
router.put("/Embarcaciones/:id", putEmbarcacion);
// DELETE destinatarios
router.delete("/Embarcaciones/:id", deleteEmbarcacion);
// PAGINATION
router.post('/EmbarcacionesFiltered', embarcacionesFiltered);

export default router;

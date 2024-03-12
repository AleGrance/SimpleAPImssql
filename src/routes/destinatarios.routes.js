import { Router } from "express";
import { getDestinatarios, postDestinatario, putDestinatario, destinatariosFiltered } from "../controllers/destinatarios.controller.js";

const router = Router();

// GET destinatarios
router.get("/destinatarios", getDestinatarios);
// POST destinatarios
router.post("/destinatarios", postDestinatario);
// PUT destinatarios
router.put("/destinatarios/:id", putDestinatario);
// PAGINATION
router.post('/destinatariosFiltered', destinatariosFiltered);

export default router;

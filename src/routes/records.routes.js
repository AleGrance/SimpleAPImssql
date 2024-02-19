import { Router } from "express";
import { getRecords, postRecord } from "../controllers/records.controller.js";

const router = Router();

router.get("/records", getRecords);

router.post("/records", postRecord);

export default router;

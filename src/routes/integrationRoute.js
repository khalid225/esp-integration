import { Router } from "express";
import { saveAndValidateIntegration, getLists } from "../controllers/integrationsController.js";

const router = Router();

router.get("/lists", getLists);
router.post("/", saveAndValidateIntegration);

export default router;

import { Router } from "express";
import * as razaController from "../controllers/RazaController.js";
import { validateRaza } from "../validators/razaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = Router();

router.post("/", validateRaza, razaController.createRaza);
router.get(
  "/activas/:granja_id",
  validateIdParam,
  razaController.listRazasActivas
);
router.get("/todas/:granja_id", validateIdParam, razaController.listRazas);
router.get("/:id", validateIdParam, razaController.getRazaById);
router.post(
  "/update/:id",
  validateIdParam,
  validateRaza,
  razaController.updateRaza
);
router.post("/delete/:id", validateIdParam, razaController.deleteRaza);

export default router;

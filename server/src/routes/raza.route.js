import { Router } from "express";
import * as razaController from "../controllers/raza.controller.js";
import {
  validateCreateRaza,
  validateUpdateRaza,
} from "../validators/razaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = Router();

router.post("/", validateCreateRaza, razaController.createRaza);

router.get("/", razaController.listRazas);

router.get("/:id", validateIdParam, razaController.getRazaById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateRaza,
  razaController.updateRaza
);

router.post("/delete/:id", validateIdParam, razaController.deleteRaza);

export default router;

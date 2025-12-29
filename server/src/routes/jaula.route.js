import { Router } from "express";
import * as jaulaController from "../controllers/jaula.controller.js";
import {
  validateCreateJuala,
  validateUpdateJaula,
} from "../validators/jaulaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = Router();

router.post("/", validateCreateJuala, jaulaController.createJaula);

router.get("/", jaulaController.listJaulas);

router.get("/:id", validateIdParam, jaulaController.getJaulaById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateJaula,
  jaulaController.updateJaula
);

router.post("/delete/:id", validateIdParam, jaulaController.deleteJaula);

export default router;

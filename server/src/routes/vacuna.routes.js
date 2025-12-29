import * as controller from "../controllers/vacuna.controller.js";
import express from "express";
import {
  validateCreateVacuna,
  validateUpdateVacuna,
} from "../validators/vacunaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post("/", validateCreateVacuna, controller.createVacuna);

router.get("/", controller.listVacunas);

router.get("/:id", validateIdParam, controller.getVacunaById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateVacuna,
  controller.updateVacuna
);

router.post("/delete/:id", validateIdParam, controller.deleteVacuna);

export default router;

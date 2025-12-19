import * as controller from "../controllers/vacuna.controller.js";
import express from "express";
import {
  validateCreateVacuna,
  validateUpdateVacuna,
} from "../validators/vacunaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateVacuna,
  controller.createVacuna
);

router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listVacunas
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getVacunaById
);

router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateVacuna,
  controller.updateVacuna
);

router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteVacuna
);

export default router;

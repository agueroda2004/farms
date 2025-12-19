import * as controller from "../controllers/adopcion.controller.js";
import express from "express";
import {
  validateCreateAdopcion,
  validateUpdateAdopcion,
} from "../validators/adopcionValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateAdopcion,
  controller.createAdopcion
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getAdopcionById
);

router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listAdopciones
);

router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateAdopcion,
  controller.updateAdopcion
);

router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteAdopcion
);

export default router;

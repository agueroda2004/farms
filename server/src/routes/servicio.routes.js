import e from "express";
import * as controller from "../controllers/servicioController.js";
import express from "express";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";
import { validateIdParam } from "../validators/globalValidator.js";
import {
  validateCreateServicio,
  validateUpdateServicio,
} from "../validators/servicioValidator.js";
const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateServicio,
  controller.createServicio
);

router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateServicio,
  controller.updateServicio
);

router.post(
  "/delete/:id",
  checkGranjaAccess,
  validateIdParam,
  controller.deleteServicio
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getServicioById
);

router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listServicios
);

export default router;

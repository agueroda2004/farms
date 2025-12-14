import { Router } from "express";
import * as jaulaController from "../controllers/jaulaController.js";
import {
  validateCreateJuala,
  validateDeleteJaula,
  validateUpdateJaula,
} from "../validators/jaulaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateJuala,
  jaulaController.createJaula
);

router.get(
  "/all/:granja_id",
  checkGranjaAccess,
  validateIdParam,
  jaulaController.listJaulas
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  checkGranjaAccess,
  validateIdParam,
  jaulaController.getJaulaById
);

router.post(
  "/update/:id",
  checkGranjaAccess,
  validateIdParam,
  validateUpdateJaula,
  jaulaController.updateJaula
);

router.post(
  "/delete/:id",
  checkGranjaAccess,
  validateIdParam,
  validateDeleteJaula,
  jaulaController.deleteJaula
);

export default router;

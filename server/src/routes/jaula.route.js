import { Router } from "express";
import * as jaulaController from "../controllers/jaula.controller.js";
import {
  validateCreateJuala,
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

// ? Se debe mandar el granja_id para validar el acceso
// ? Se debe mandar en el body el animal (cerda o berraco) para desactivar la jaula
router.post(
  "/delete/:id",
  checkGranjaAccess,
  validateIdParam,
  jaulaController.deleteJaula
);

export default router;

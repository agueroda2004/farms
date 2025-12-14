import { Router } from "express";
import * as razaController from "../controllers/RazaController.js";
import {
  validateCreateRaza,
  validateUpdateRaza,
} from "../validators/razaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateRaza,
  razaController.createRaza
);

router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  razaController.listRazas
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  checkGranjaAccess,
  validateIdParam,
  razaController.getRazaById
);

router.post(
  "/update/:id",
  checkGranjaAccess,
  validateIdParam,
  validateUpdateRaza,
  razaController.updateRaza
);

router.post(
  "/delete/:id",
  checkGranjaAccess,
  validateIdParam,
  razaController.deleteRaza
);

export default router;

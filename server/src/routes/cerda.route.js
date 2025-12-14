import { Router } from "express";
import * as controller from "../controllers/cerdaController.js";
import {
  validateCreateCerda,
  validateUpdateCerda,
} from "../validators/cerdaValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateCerda,
  controller.createCerda
);

router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listCerdas
);

// ? Se debe mandar el granja_id para validar el acceso
router.get("/:id", checkGranjaAccess, validateIdParam, controller.getCerdaById);

router.post(
  "/update/:id",
  checkGranjaAccess,
  validateIdParam,
  validateUpdateCerda,
  controller.updateCerda
);

export default router;

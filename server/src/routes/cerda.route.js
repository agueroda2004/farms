import { Router } from "express";
import * as controller from "../controllers/cerdaController.js";
import {
  validateCreateCerda,
  validateUpdateCerda,
} from "../validators/cerdaValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = Router();

// ✅
router.post(
  "/",
  validateCreateCerda,
  checkGranjaAccess,
  controller.createCerda
);

// ✅
router.get(
  "/activas/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listCerdasActivas
);

// ✅
router.get(
  "/todas/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listCerdas
);

// ✅
router.get("/:id", validateIdParam, controller.getCerdaById);

// ✅
router.post(
  "/update/:id",
  validateUpdateCerda,
  validateIdParam,
  checkGranjaAccess,
  controller.updateCerda
);

// ✅
router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteCerda
);

export default router;

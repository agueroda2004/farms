import { Router } from "express";
import * as razaController from "../controllers/RazaController.js";
import { validateRaza } from "../validators/razaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = Router();

// ✅
router.post("/", validateRaza, checkGranjaAccess, razaController.createRaza);

// ✅
router.get(
  "/activas/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  razaController.listRazasActivas
);

// ✅
router.get(
  "/todas/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  razaController.listRazas
);

// ✅
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  razaController.getRazaById
);

// ✅
router.post(
  "/update/:id",
  validateIdParam,
  validateRaza,
  checkGranjaAccess,
  razaController.updateRaza
);

// ✅
router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  razaController.deleteRaza
);

export default router;

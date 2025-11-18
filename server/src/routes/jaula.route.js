import { Router } from "express";
import * as jaulaController from "../controllers/jaulaController.js";
import { validateJaula } from "../validators/jaulaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = Router();

// ✅
router.post("/", checkGranjaAccess, validateJaula, jaulaController.createJaula);

// ✅
router.get(
  "/activas/:granja_id",
  checkGranjaAccess,
  jaulaController.listJaulasActivas
);

// ✅
router.get("/todas/:granja_id", checkGranjaAccess, jaulaController.listJaulas);

// ✅
router.get(
  "/activas/:granja_id",
  checkGranjaAccess,
  jaulaController.listJaulasActivas
);

// ✅
router.get(
  "/:id",
  checkGranjaAccess,
  validateIdParam,
  jaulaController.getJaulaById
);

// ✅
router.post(
  "/update/:id",
  checkGranjaAccess,
  validateIdParam,
  validateJaula,
  jaulaController.updateJaula
);

// ✅
router.post(
  "/delete/:id",
  checkGranjaAccess,
  validateIdParam,
  jaulaController.deleteJaula
);

export default router;

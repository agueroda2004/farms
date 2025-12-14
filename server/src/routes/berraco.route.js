import * as controller from "../controllers/berracoController.js";
import express from "express";
import {
  validateCreateBerraco,
  validateUpdateBerraco,
} from "../validators/berracoValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateBerraco,
  controller.createBerraco
);
router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listBerracos
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getBerracoById
);

router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateBerraco,
  controller.updateBerraco
);

export default router;

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
  validateCreateBerraco,
  checkGranjaAccess,
  controller.createBerraco
);
router.get(
  "/granja/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listBerracosByGranja
);
router.get("/:id", validateIdParam, controller.getBerracoById);
router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateBerraco,
  controller.updateBerraco
);
router.post("/delete/:id", validateIdParam, controller.deleteBerraco);

export default router;

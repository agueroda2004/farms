import * as controller from "../controllers/partoController.js";
import express from "express";
import {
  validateCreateParto,
  validateUpdateParto,
} from "../validators/partoValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateParto,
  controller.createParto
);

router.get("/:id", validateIdParam, checkGranjaAccess, controller.getPartoById);

router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listPartos
);

router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateParto,
  controller.updateParto
);
router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteParto
);

export default router;

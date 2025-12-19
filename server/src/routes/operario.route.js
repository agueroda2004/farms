import * as controller from "../controllers/operario.controller.js";
import express from "express";
import {
  validateCreateOperario,
  validateUpdateOperario,
} from "../validators/operarioValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateOperario,
  controller.createOperario
);
router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listOperarios
);
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getOperarioById
);
router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateOperario,
  controller.updateOperario
);
router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteOperario
);
export default router;

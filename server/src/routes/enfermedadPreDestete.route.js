import * as controller from "../controllers/enfermedadPreDestete.controller.js";
import express from "express";
import {
  validateCreateEnfermedadPreDestete,
  validateUpdateEnfermedadPreDestete,
} from "../validators/enfermedadPreDesteteValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateEnfermedadPreDestete,
  controller.createEnfermedadPreDestete
);

router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getEnfermedadPreDesteteById
);
router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listEnfermedadPreDestete
);
router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateEnfermedadPreDestete,
  controller.updateEnfermedadPreDestete
);
router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteEnfermedadPreDestete
);

export default router;

import * as controller from "../controllers/destete.controller.js";
import express from "express";
import {
  validateCreateDestete,
  validateUpdateDestete,
} from "../validators/desteteValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateDestete,
  controller.createDestete
);
router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listDestetes
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getDesteteById
);
router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateDestete,
  controller.updateDestete
);
router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteDestete
);
export default router;

import * as controller from "../controllers/donacion.controller.js";
import express from "express";
import {
  validateCreateDonacion,
  validateUpdateDonacion,
} from "../validators/donacionValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateDonacion,
  controller.createDonacion
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getDonacionById
);

router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listDonaciones
);

router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateDonacion,
  controller.updateDonacion
);

router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteDonacion
);

export default router;

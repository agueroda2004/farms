import * as controller from "../controllers/muertoPreDestete.controller.js";
import express from "express";
import {
  validateCreateMuertoPreDestete,
  validateUpdateMuertoPreDestete,
} from "../validators/muertoPreDesteteValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateMuertoPreDestete,
  controller.createMuertoPreDestete
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getMuertoPreDesteteById
);

router.get(
  "/all/:granja_id",
  checkGranjaAccess,
  controller.listMuertoPreDestete
);

router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateMuertoPreDestete,
  controller.updateMuertoPreDestete
);

router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteMuertoPreDestete
);

export default router;

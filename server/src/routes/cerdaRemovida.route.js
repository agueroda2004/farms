import * as controller from "../controllers/cerdaRemovida.controller.js";
import express from "express";
import {
  validateCreateCerdaRemovida,
  validateUpdateCerdaRemovida,
} from "../validators/cerdaRemovidaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateCerdaRemovida,
  controller.createCerdaRemovida
);

router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listCerdasRemovidas
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getCerdaRemovidaById
);

router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateCerdaRemovida,
  controller.updateCerdaRemovida
);

router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteCerdaRemovida
);

export default router;

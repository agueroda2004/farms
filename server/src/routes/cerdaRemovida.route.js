import * as controller from "../controllers/cerdaRemovidaController.js";
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
  validateCreateCerdaRemovida,
  checkGranjaAccess,
  controller.createCerdaRemovida
);

router.get(
  "/todas/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listCerdasRemovidas
);

router.get("/:id", validateIdParam, controller.getCerdaRemovidaById);

router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateCerdaRemovida,
  controller.updateCerdaRemovida
);

router.post(
  "/delete/",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteCerdaRemovida
);

export default router;

import * as controller from "../controllers/aborto.controller.js";
import express from "express";
import {
  validateCreateAborto,
  validateUpdateAborto,
} from "../validators/abortoValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  validateCreateAborto,
  checkGranjaAccess,
  controller.createAborto
);
router.get(
  "/todas/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listAbortosByGranja
);
router.get("/:id", validateIdParam, controller.getAbortoById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateAborto,
  checkGranjaAccess,
  controller.updateAborto
);

router.post(
  "/delete/",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteAborto
);

export default router;

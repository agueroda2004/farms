import * as controller from "../controllers/berracoRemovido.controller.js";
import express from "express";
import {
  validateCreateBerracoRemovido,
  validateUpdateBerracoRemovido,
} from "../validators/berracoRemovidoValidator.js";
import { validateIdParam } from "../validators/commonValidators.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  validateCreateBerracoRemovido,
  controller.createBerracoRemovido
);

router.get(
  "/granja/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listBerracosRemovidosByGranja
);

router.get("/:id", validateIdParam, controller.getBerracoRemovidoById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateBerracoRemovido,
  controller.updateBerracoRemovido
);

router.post("/delete/:id", validateIdParam, controller.deleteBerracoRemovido);

export default router;

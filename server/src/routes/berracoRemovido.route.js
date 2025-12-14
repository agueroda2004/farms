import * as controller from "../controllers/berracoRemovidoController.js";
import express from "express";
import {
  validateCreateBerracoRemovido,
  validateUpdateBerracoRemovido,
} from "../validators/berracoRemovidoValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateBerracoRemovido,
  controller.createBerracoRemovido
);

router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listBerracosRemovidos
);

// ? Se debe mandar el granja_id para validar el acceso
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getBerracoRemovidoById
);

router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateBerracoRemovido,
  controller.updateBerracoRemovido
);

router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteBerracoRemovido
);

export default router;

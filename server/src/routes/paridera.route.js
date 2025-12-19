import * as controller from "../controllers/paridera.controller.js";
import express from "express";
import {
  validateCreateParidera,
  validateUpdateParidera,
} from "../validators/parideraValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  checkGranjaAccess,
  validateCreateParidera,
  controller.createParidera
);

router.get(
  "/all/:granja_id",
  validateIdParam,
  checkGranjaAccess,
  controller.listParideras
);
router.get(
  "/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.getParideraById
);
router.post(
  "/update/:id",
  validateIdParam,
  checkGranjaAccess,
  validateUpdateParidera,
  controller.updateParidera
);
router.post(
  "/delete/:id",
  validateIdParam,
  checkGranjaAccess,
  controller.deleteParidera
);

export default router;

import { Router } from "express";
import * as controller from "../controllers/cerda.controller.js";
import {
  validateCreateCerda,
  validateUpdateCerda,
} from "../validators/cerdaValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = Router();

router.post("/", validateCreateCerda, controller.createCerda);

router.get("/", controller.listCerdas);

router.get("/:id", validateIdParam, controller.getCerdaById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateCerda,
  controller.updateCerda
);

export default router;

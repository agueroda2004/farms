import * as controller from "../controllers/berraco.controller.js";
import express from "express";
import {
  validateCreateBerraco,
  validateUpdateBerraco,
} from "../validators/berracoValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post("/", validateCreateBerraco, controller.createBerraco);

router.get("/", controller.listBerracos);

router.get("/:id", validateIdParam, controller.getBerracoById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateBerraco,
  controller.updateBerraco
);

export default router;

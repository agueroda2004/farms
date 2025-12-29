import * as controller from "../controllers/parto.controller.js";
import express from "express";
import {
  validateCreateParto,
  validateUpdateParto,
} from "../validators/partoValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post("/", validateCreateParto, controller.createParto);

router.get("/:id", validateIdParam, controller.getPartoById);

router.get("/", controller.listPartos);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateParto,
  controller.updateParto
);
router.post("/delete/:id", validateIdParam, controller.deleteParto);

export default router;

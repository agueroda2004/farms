import * as controller from "../controllers/adopcion.controller.js";
import express from "express";
import {
  validateCreateAdopcion,
  validateUpdateAdopcion,
} from "../validators/adopcionValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post("/", validateCreateAdopcion, controller.createAdopcion);

router.get("/:id", validateIdParam, controller.getAdopcionById);

router.get("/", controller.listAdopciones);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateAdopcion,
  controller.updateAdopcion
);

router.post("/delete/:id", validateIdParam, controller.deleteAdopcion);

export default router;

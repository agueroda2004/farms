import * as controller from "../controllers/enfermedadPreDestete.controller.js";
import express from "express";
import {
  validateCreateEnfermedadPreDestete,
  validateUpdateEnfermedadPreDestete,
} from "../validators/enfermedadPreDesteteValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post(
  "/",
  validateCreateEnfermedadPreDestete,
  controller.createEnfermedadPreDestete
);

router.get("/:id", validateIdParam, controller.getEnfermedadPreDesteteById);

router.get("/", controller.listEnfermedadPreDestete);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateEnfermedadPreDestete,
  controller.updateEnfermedadPreDestete
);
router.post(
  "/delete/:id",
  validateIdParam,
  controller.deleteEnfermedadPreDestete
);

export default router;

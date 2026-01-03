import * as controller from "../controllers/destete.controller.js";
import express from "express";
import {
  validateCreateDestete,
  validateUpdateDestete,
} from "../validators/desteteValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post("/", validateCreateDestete, controller.createDestete);
router.get("/", controller.listDestetes);

router.get("/:id", validateIdParam, controller.getDesteteById);
router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateDestete,
  controller.updateDestete
);
router.post("/delete/:id", validateIdParam, controller.deleteDestete);
export default router;

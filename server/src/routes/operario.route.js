import * as controller from "../controllers/operario.controller.js";
import express from "express";
import {
  validateCreateOperario,
  validateUpdateOperario,
} from "../validators/operarioValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post("/", validateCreateOperario, controller.createOperario);
router.get("/", controller.listOperarios);
router.get("/:id", validateIdParam, controller.getOperarioById);
router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateOperario,
  controller.updateOperario
);
router.post("/delete/:id", validateIdParam, controller.deleteOperario);
export default router;

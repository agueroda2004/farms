import * as controller from "../controllers/servicio.controller.js";
import express from "express";
import { validateIdParam } from "../validators/globalValidator.js";
import {
  validateCreateServicio,
  validateUpdateServicio,
} from "../validators/servicioValidator.js";

const router = express.Router();

router.post("/", validateCreateServicio, controller.createServicio);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateServicio,
  controller.updateServicio
);

router.post("/delete/:id", validateIdParam, controller.deleteServicio);

router.get("/:id", validateIdParam, controller.getServicioById);

router.get("/", controller.listServicios);

export default router;

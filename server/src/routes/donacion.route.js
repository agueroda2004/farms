import * as controller from "../controllers/donacion.controller.js";
import express from "express";
import {
  validateCreateDonacion,
  validateUpdateDonacion,
} from "../validators/donacionValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post("/", validateCreateDonacion, controller.createDonacion);

router.get("/:id", validateIdParam, controller.getDonacionById);

router.get("/", controller.listDonaciones);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateDonacion,
  controller.updateDonacion
);

router.post("/delete/:id", validateIdParam, controller.deleteDonacion);

export default router;

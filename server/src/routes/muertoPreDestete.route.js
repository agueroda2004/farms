import * as controller from "../controllers/muertoPreDestete.controller.js";
import express from "express";
import {
  validateCreateMuertoPreDestete,
  validateUpdateMuertoPreDestete,
} from "../validators/muertoPreDesteteValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post(
  "/",
  validateCreateMuertoPreDestete,
  controller.createMuertoPreDestete
);

router.get("/:id", validateIdParam, controller.getMuertoPreDesteteById);

router.get("/", controller.listMuertoPreDestete);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateMuertoPreDestete,
  controller.updateMuertoPreDestete
);

router.post("/delete/:id", validateIdParam, controller.deleteMuertoPreDestete);

export default router;

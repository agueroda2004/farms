import * as controller from "../controllers/aborto.controller.js";
import express from "express";
import {
  validateCreateAborto,
  validateUpdateAborto,
} from "../validators/abortoValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post("/", validateCreateAborto, controller.createAborto);
router.get("/", controller.listAbortos);

router.get("/:id", validateIdParam, controller.getAbortoById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateAborto,
  controller.updateAborto
);

router.post("/delete/:id", validateIdParam, controller.deleteAborto);

export default router;

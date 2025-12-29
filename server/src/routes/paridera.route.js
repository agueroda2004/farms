import * as controller from "../controllers/paridera.controller.js";
import express from "express";
import {
  validateCreateParidera,
  validateUpdateParidera,
} from "../validators/parideraValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post("/", validateCreateParidera, controller.createParidera);

router.get("/", controller.listParideras);
router.get("/:id", validateIdParam, controller.getParideraById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateParidera,
  controller.updateParidera
);
router.post("/delete/:id", validateIdParam, controller.deleteParidera);

export default router;

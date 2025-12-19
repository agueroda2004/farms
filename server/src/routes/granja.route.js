import { Router } from "express";
import * as granjaController from "../controllers/granja.controller.js";
import {
  validateCreateGranja,
  validateUpdateGranja,
} from "../validators/granjaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = Router();

router.post("/", validateCreateGranja, granjaController.createGranja);

router.get("/", granjaController.listGranjas);

router.get("/:id", validateIdParam, granjaController.getGranjaById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateGranja,
  granjaController.updateGranja
);

router.post("/delete/:id", validateIdParam, granjaController.deleteGranja);

export default router;

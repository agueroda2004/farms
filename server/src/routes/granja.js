import { Router } from "express";
import * as granjaController from "../controllers/granjaController.js";
import {
  validateGranja,
  validateIdParam,
} from "../validators/granjaValidator.js";

const router = Router();

router.post("/", validateGranja, granjaController.createGranja);
router.get("/", granjaController.listGranjas);
router.get("/:id", validateIdParam, granjaController.getGranjaById);
router.post(
  "/update/:id",
  validateIdParam,
  validateGranja,
  granjaController.updateGranja
);
router.post("/delete/:id", validateIdParam, granjaController.deleteGranja);

export default router;

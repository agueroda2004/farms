import * as controller from "../controllers/cerdaRemovida.controller.js";
import express from "express";
import {
  validateCreateCerdaRemovida,
  validateUpdateCerdaRemovida,
} from "../validators/cerdaRemovidaValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = express.Router();

router.post("/", validateCreateCerdaRemovida, controller.createCerdaRemovida);

router.get("/", controller.listCerdasRemovidas);

router.get("/:id", validateIdParam, controller.getCerdaRemovidaById);

router.post(
  "/update/:id",
  validateIdParam,
  validateUpdateCerdaRemovida,
  controller.updateCerdaRemovida
);

router.post("/delete/:id", validateIdParam, controller.deleteCerdaRemovida);

export default router;

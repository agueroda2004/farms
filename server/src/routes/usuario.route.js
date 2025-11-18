import { Router } from "express";
import * as usuarioController from "../controllers/usuarioController.js";
import {
  validateUsuario,
  validateUpdateUsuario,
} from "../validators/usuarioValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";
import { checkGranjaAccess } from "../auth/middlewares/authMiddleware.js";

const router = Router();

// ✅
router.get("/", usuarioController.listUsuarios);

// ✅
router.get("/:id", validateIdParam, usuarioController.getUsuarioById);

// ✅
router.post(
  "/",
  checkGranjaAccess,
  validateUsuario,
  usuarioController.createUsuario
);

// ✅
router.get(
  "/granja/:granja_id",
  checkGranjaAccess,
  usuarioController.listUsuariosByGranja
);

// ✅
router.post(
  "/update/:id",
  checkGranjaAccess,
  validateIdParam,
  validateUpdateUsuario,
  usuarioController.updateUsuario
);

// ✅
router.post(
  "/delete/:id",
  checkGranjaAccess,
  validateIdParam,
  usuarioController.deleteUsuario
);

export default router;

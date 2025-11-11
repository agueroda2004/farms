import { Router } from "express";
import * as usuarioController from "../controllers/usuarioController.js";
import { validateUsuario } from "../validators/usuarioValidator.js";
import { validateIdParam } from "../validators/globalValidator.js";

const router = Router();

router.post("/", validateUsuario, usuarioController.createUsuario);
router.get("/", usuarioController.listUsuarios);
router.get("/:id", validateIdParam, usuarioController.getUsuarioById);
router.post(
  "/update/:id",
  validateIdParam,
  validateUsuario,
  usuarioController.updateUsuario
);
router.post("/delete/:id", validateIdParam, usuarioController.deleteUsuario);

export default router;

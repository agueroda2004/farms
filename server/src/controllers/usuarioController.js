import * as service from "../services/usuarioService.js";
import { Prisma } from "@prisma/client";

export const createUsuario = async (req, res, next) => {
  try {
    const { nombre, email, password, granja_id, admin } = req.body;
    const usuario = await service.createUsuario({
      nombre,
      email,
      password,
      granja_id,
      admin,
    });
    res
      .status(201)
      .json({ message: "Usuario creado exitosamente.", usuario: usuario });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({ error: "El email ya está en uso." });
      }
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "La granja_id proporcionada no existe." });
      }
    }
    next(error);
  }
};

export const listUsuarios = async (req, res, next) => {
  try {
    const usuarios = await service.listUsuarios();
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ error: "No se encontraron usuarios." });
    }
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

export const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await service.getUsuarioById(Number(id));
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado." });
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

export const updateUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, granja_id, admin, activo } = req.body;
    const updatedUsuario = await service.updateUsuario(Number(id), {
      nombre,
      email,
      password,
      granja_id,
      admin,
      activo,
    });

    if (!updatedUsuario)
      return res.status(404).json({ error: "Usuario no encontrado." });

    res.json({
      message: `Éxito al actualizar el usuario ${updatedUsuario.nombre}`,
      usuario: updatedUsuario,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({ error: "El email ya está en uso." });
      }
      if (error.code === "P2003") {
        return res
          .status(400)
          .json({ error: "La granja_id proporcionada no existe." });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }
    }
    next(error);
  }
};

export const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await service.deleteUsuario(Number(id));
    res.json({ message: "Usuario eliminado exitosamente.", usuario: deleted });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        const updatedUsuario = await service.updateUsuario(Number(id), {
          activo: false,
        });
        return res.json({
          message:
            "El usuario no se pudo eliminar porque está relacionado con otros registros. Se ha desactivado en su lugar.",
          usuario: updatedUsuario,
        });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }
    }
    next(error);
  }
};

import * as service from "../services/granjaService.js";
import { Prisma } from "@prisma/client";

export const createGranja = async (req, res, next) => {
  try {
    const { nombre } = req.body;
    const granja = await service.createGranja({ nombre });
    res.json({
      message: `Éxito al crear la granja ${granja.nombre}`,
      granja,
    });
  } catch (error) {
    next(error);
  }
};

export const listGranjas = async (req, res, next) => {
  try {
    const granjas = await service.listGranjas();
    if (!granjas || granjas.length === 0) {
      return res.status(404).json({ error: "No se encontraron granjas." });
    }
    res.json(granjas);
  } catch (error) {
    next(error);
  }
};

export const getGranjaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const granja = await service.getGranjaById(Number(id));
    if (!granja)
      return res.status(404).json({ error: "Granja no encontrada." });

    res.json(granja);
  } catch (error) {
    next(error);
  }
};

export const updateGranja = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, activo } = req.body;
    const dataToUpdate = {};

    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (activo !== undefined) dataToUpdate.activo = activo;

    const updated = await service.updateGranja(Number(id), dataToUpdate);
    res.json({
      message: `Éxito al actualizar la granja ${updated.nombre}`,
      farm: updated,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Granja no encontrada." });
      }
    }
    next(error);
  }
};

export const deleteGranja = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await service.deleteGranja(Number(id));
    res.json(deleted);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const updated = await service.updateGranja(Number(req.params.id), {
          activo: false,
        });
        return res.json({
          message:
            "La granja no se pudo eliminar porque está relacionada con otros registros. Se ha desactivado en su lugar.",
          granja: updated,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

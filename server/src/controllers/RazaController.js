import * as service from "../services/razaService.js";
import { Prisma } from "@prisma/client";

// ✅
export const createRaza = async (req, res, next) => {
  try {
    const { nombre, granja_id } = req.body;
    const raza = await service.createRaza({
      nombre,
      granja: { connect: { id: Number(granja_id) } },
    });
    res.json({
      message: `Éxito al crear la raza ${raza.nombre}`,
      raza,
    });
  } catch (error) {
    next(error);
  }
};

// ✅
export const listRazasActivas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const razas = await service.listRazasActivas(Number(granja_id));
    if (razas.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron razas activas." });
    }
    res.json(razas);
  } catch (error) {
    next(error);
  }
};

// ✅
export const listRazas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const razas = await service.listRazas(Number(granja_id));
    if (razas.length === 0) {
      return res.status(404).json({ error: "No se encontraron razas." });
    }
    res.json(razas);
  } catch (error) {
    next(error);
  }
};

// ✅
export const getRazaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const raza = await service.getRazaById(Number(id));
    if (!raza) return res.status(404).json({ error: "Raza no encontrada." });
    res.json(raza);
  } catch (error) {
    next(error);
  }
};

// ✅
export const updateRaza = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, granja_id, activo } = req.body;
    const dataToUpdate = {};

    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (granja_id !== undefined) dataToUpdate.granja_id = granja_id;
    if (activo !== undefined) dataToUpdate.activo = activo;

    const raza = await service.updateRaza(Number(id), dataToUpdate);
    res.json({
      message: `Éxito al actualizar la raza ${raza.nombre}`,
      raza,
    });
  } catch (error) {
    next(error);
  }
};

// ✅
export const deleteRaza = async (req, res, next) => {
  try {
    const { id } = req.params;
    const raza = await service.deleteRaza(Number(id));
    res.json({
      message: `Éxito al eliminar la raza ${raza.nombre}`,
      raza,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const razaDesactivada = await service.updateRaza(
          Number(req.params.id),
          { activo: false }
        );
        return res.status(200).json({
          message: `La raza ${razaDesactivada.nombre} esta asociada a otros registros por lo que ha sido desactivada en lugar de eliminada.`,
          raza: razaDesactivada,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

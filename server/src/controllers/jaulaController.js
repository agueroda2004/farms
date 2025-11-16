import * as service from "../services/jaulaService.js";
import { Prisma } from "@prisma/client";

export const createJaula = async (req, res, next) => {
  try {
    const { nombre, granja_id } = req.body;
    const jaula = await service.createJaula({
      nombre,
      granja: { connect: { id: Number(granja_id) } },
    });
    res.json({
      message: `Éxito al crear la jaula ${jaula.nombre}`,
      jaula,
    });
  } catch (error) {
    next(error);
  }
};

export const listJaulasActivas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const jaulas = await service.listJaulasActivas(Number(granja_id));
    if (jaulas.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron jaulas activas." });
    }
    res.json(jaulas);
  } catch (error) {
    next(error);
  }
};

export const listJaulas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const jaulas = await service.listJaulas(Number(granja_id));
    if (jaulas.length === 0) {
      return res.status(404).json({ error: "No se encontraron jaulas." });
    }
    res.json(jaulas);
  } catch (error) {
    next(error);
  }
};

export const getJaulaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jaula = await service.getJaulaById(Number(id));
    if (!jaula) return res.status(404).json({ error: "Jaula no encontrada." });
    res.json(jaula);
  } catch (error) {
    next(error);
  }
};
export const updateJaula = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, granja_id, acivo } = req.body;
    const jaula = await service.updateJaula(Number(id), {
      nombre,
      granja: { connect: { id: Number(granja_id) } },
      acivo,
    });
    res.json({
      message: `Éxito al actualizar la jaula ${jaula.nombre}`,
      jaula,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteJaula = async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.deleteJaula(Number(id));
    res.json({ message: "Jaula eliminada exitosamente." });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const jaulaDesactivada = await service.updateJaula(Number(id), {
          activo: false,
        });
        res.json({
          message: `La jaula ${jaulaDesactivada.nombre} esta asociada a otros registros por lo que ha sido desactivada en lugar de eliminada.`,
          jaula: jaulaDesactivada,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

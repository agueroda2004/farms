import * as service from "../services/jaulaService.js";
import { Prisma } from "@prisma/client";

export const createJaula = async (req, res, next) => {
  try {
    const jaula = await service.createJaula(req.body);
    res.status(201).json({
      message: "Jaula created successfully",
      jaula,
    });
  } catch (error) {
    next(error);
  }
};

export const listJaulas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const jaulas = await service.listJaulas(Number(granja_id));

    res.json(jaulas);
  } catch (error) {
    next(error);
  }
};

export const getJaulaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jaula = await service.getJaulaById(Number(id));
    if (!jaula) return res.status(404).json({ error: "Jaula not found." });
    res.json(jaula);
  } catch (error) {
    next(error);
  }
};
export const updateJaula = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jaulaUpdated = await service.updateJaula(Number(id), req.body);
    res.json({
      message: "Jaula updated successfully.",
      jaula: jaulaUpdated,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteJaula = async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.deleteJaula(Number(id));
    res.json({ message: "Jaula deleted successfully." });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const jaulaDesactivada = await service.desactivarJaula(
          Number(id),
          req.body
        );
        res.json({
          message:
            "The jaula is associated with other records and has been deactivated instead of deleted.",
          jaula: jaulaDesactivada,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

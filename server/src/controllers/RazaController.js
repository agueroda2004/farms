import * as service from "../services/razaService.js";
import { Prisma } from "@prisma/client";

export const createRaza = async (req, res, next) => {
  try {
    const raza = await service.createRaza(req.body);
    res.status(201).json({
      message: "Raza created successfully",
      raza,
    });
  } catch (error) {
    next(error);
  }
};

export const listRazas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const razas = await service.listRazas(Number(granja_id));

    res.json(razas);
  } catch (error) {
    next(error);
  }
};

export const getRazaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const raza = await service.getRazaById(Number(id));
    if (!raza) return res.status(404).json({ error: "Raza not found." });
    res.json(raza);
  } catch (error) {
    next(error);
  }
};

export const updateRaza = async (req, res, next) => {
  try {
    const { id } = req.params;

    const raza = await service.updateRaza(Number(id), req.body);
    res.json({
      message: "Raza updated successfully.",
      raza,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRaza = async (req, res, next) => {
  try {
    const { id } = req.params;
    const raza = await service.deleteRaza(Number(id));
    res.json({
      message: "Raza deleted successfully.",
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
          message: `The Raza is associated with other records and has been deactivated instead of deleted.`,
          raza: razaDesactivada,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

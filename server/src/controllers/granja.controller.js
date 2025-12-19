import * as service from "../services/granja.service.js";
import { Prisma } from "@prisma/client";

export const createGranja = async (req, res, next) => {
  try {
    const granja = await service.createGranja(req.body);
    res.status(201).json({
      message: "Granja created successfully",
      granja,
    });
  } catch (error) {
    next(error);
  }
};

export const listGranjas = async (req, res, next) => {
  try {
    const granjas = await service.listGranjas();
    res.status(200).json(granjas);
  } catch (error) {
    next(error);
  }
};

export const getGranjaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const granja = await service.getGranjaById(Number(id));
    if (!granja) return res.status(404).json({ error: "Granja not found." });
    res.status(200).json(granja);
  } catch (error) {
    next(error);
  }
};

export const updateGranja = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedGranja = await service.updateGranja(Number(id), req.body);
    res.json({
      message: "Granja updated successfully",
      granja: updatedGranja,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGranja = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedGranja = await service.deleteGranja(Number(id));
    res.json({ message: "Granja deleted successfully", granja: deletedGranja });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const updatedGranja = await service.updateGranja(
          Number(req.params.id),
          {
            activo: false,
          }
        );
        return res.json({
          message:
            "Granja desactivated instead of deleted due to existing dependencies.",
          granja: updatedGranja,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

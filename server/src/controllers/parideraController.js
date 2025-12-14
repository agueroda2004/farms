import { Prisma } from "@prisma/client";
import * as service from "../services/parideraService.js";

export const createParidera = async (req, res, next) => {
  try {
    const paridera = await service.createParidera(req.body);
    res
      .status(201)
      .json({ message: "Paridera created successfully", paridera });
  } catch (error) {
    next(error);
  }
};
export const listParideras = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const parideras = await service.listParideras(granja_id);

    res.status(200).json(parideras);
  } catch (error) {
    next(error);
  }
};

export const getParideraById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paridera = await service.getParideraById(id);
    if (!paridera)
      return res.status(404).json({ error: "Paridera not found." });
    res.status(200).json(paridera);
  } catch (error) {
    next(error);
  }
};

export const updateParidera = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paridera = await service.updateParidera(id, req.body);
    res
      .status(201)
      .json({ message: "Paridera updated successfully", paridera });
  } catch (error) {
    next(error);
  }
};

export const deleteParidera = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedParidera = await service.deleteParidera(id);
    res.status(201).json({
      message: "Paridera deleted successfully",
      paridera: deletedParidera,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const parideraDesactivada = await service.desactivarParidera(id);
        return res.status(201).json({
          message: "Paridera desactivated successfully",
          paridera: parideraDesactivada,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

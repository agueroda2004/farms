import * as service from "../services/vacunaService.js";

export const createVacuna = async (req, res, next) => {
  try {
    const vacuna = await service.createVacuna(req.body);
    res.status(201).json({ message: "Vacuna created successfully", vacuna });
  } catch (error) {
    next(error);
  }
};

export const listVacunas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const vacunas = await service.listVacunas(granja_id);
    res.status(200).json(vacunas);
  } catch (error) {
    next(error);
  }
};

export const getVacunaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vacuna = await service.getVacunaById(id);
    if (!vacuna) {
      return res.status(404).json({ message: "Vacuna not found." });
    }
    res.status(200).json(vacuna);
  } catch (error) {
    next(error);
  }
};

export const updateVacuna = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vacuna = await service.updateVacuna(id, req.body);
    res.status(201).json({ message: "Vacuna updated successfully", vacuna });
  } catch (error) {
    next(error);
  }
};

export const deleteVacuna = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vacuna = await service.deleteVacuna(id);
    res.status(200).json({ message: "Vacuna deleted successfully", vacuna });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const deactivateVacuna = await service.updateVacuna(id, {
          activo: false,
        });
        return res.status(200).json({
          message: "Vacuna deactivated successfully",
          vacuna: deactivateVacuna,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }

    next(error);
  }
};

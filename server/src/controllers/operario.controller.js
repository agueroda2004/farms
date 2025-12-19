import { Prisma } from "@prisma/client";
export * as service from "../services/operario.service.js";

export const createOperario = async (req, res, next) => {
  try {
    const operario = await service.createOperario(req.body);
    res
      .status(201)
      .json({ message: "Operario created successfully", operario });
  } catch (error) {
    next(error);
  }
};

export const listOperarios = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const operarios = await service.listOperarios(Number(granja_id));

    res.status(200).json(operarios);
  } catch (error) {
    next(error);
  }
};

export const getOperarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const operario = await service.getOperarioById(Number(id));

    if (!operario) {
      return res.status(404).json({ message: "Operario not found." });
    }
    res.status(200).json(operario);
  } catch (error) {
    next(error);
  }
};

export const updateOperario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedOperario = await service.updateOperario(Number(id), req.body);

    res
      .status(201)
      .json({ message: "Operario updated successfully", updatedOperario });
  } catch (error) {
    next(error);
  }
};

export const deleteOperario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOperario = await service.deleteOperario(Number(id));

    res
      .status(201)
      .json({ message: "Operario deleted successfully", deletedOperario });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const operarioDesactivado = await service.updateOperario(Number(id), {
          activo: false,
        });
        return res.status(201).json({
          message:
            "Operario has related records and was deactivated instead of deleted.",
          operarioDesactivado,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

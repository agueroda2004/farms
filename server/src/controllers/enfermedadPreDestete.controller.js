import * as service from "../services/enfermedadPreDestete.service.js";

export const createEnfermedadPreDestete = async (req, res) => {
  try {
    const enfermedadPreDestete = await service.createEnfermedadPreDestete(
      req.body
    );
    return res.status(201).json({
      message: "Enfermedad pre-destete created successfully",
      enfermedadPreDestete,
    });
  } catch (error) {
    next(error);
  }
};

export const listEnfermedadPreDestete = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const enfermedadesPreDestete = await service.listEnfermedadPreDestete(
      granja_id
    );
    return res.status(200).json(enfermedadesPreDestete);
  } catch (error) {
    next(error);
  }
};

export const getEnfermedadPreDesteteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enfermedadPreDestete = await service.getEnfermedadPreDesteteById(id);
    if (!enfermedadPreDestete) {
      return res
        .status(404)
        .json({ error: "Enfermedad pre-destete not found." });
    }
    return res.status(200).json(enfermedadPreDestete);
  } catch (error) {
    next(error);
  }
};

export const updateEnfermedadPreDestete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedEnfermedadPreDestete =
      await service.updateEnfermedadPreDestete(id, req.body);
    return res.status(200).json({
      message: "Enfermedad pre-destete updated successfully",
      updatedEnfermedadPreDestete,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnfermedadPreDestete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEnfermedadPreDestete =
      await service.deleteEnfermedadPreDestete(id);
    return res.status(200).json({
      message: "Enfermedad pre-destete deleted successfully",
      deletedEnfermedadPreDestete,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const enfermedadPreDesteteDesactivada =
          await service.updateEnfermedadPreDestete(id, {
            activo: false,
          });
        return res.status(201).json({
          message: "Enfermedad pre-destete deactivated successfully",
          enfermedad: enfermedadPreDesteteDesactivada,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

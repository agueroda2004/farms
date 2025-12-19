import * as service from "../services/adopcion.service.js";

export const createAdopcion = async (req, res, next) => {
  try {
    const adopcion = await service.createAdopcion(req.body);
    res
      .status(201)
      .json({ message: "Adopcion created successfully", adopcion });
  } catch (error) {
    next(error);
  }
};

export const listAdopciones = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const adopciones = await service.listAdopciones(Number(granja_id));
    res.status(200).json(adopciones);
  } catch (error) {
    next(error);
  }
};

export const getAdopcionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adopcion = await service.getAdopcionById(Number(id));
    if (!adopcion) {
      return res.status(404).json({ error: "Adopcion not found." });
    }
    res.status(200).json(adopcion);
  } catch (error) {
    next(error);
  }
};

export const updateAdopcion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const adopcion = await service.updateAdopcion(Number(id), req.body);
    res
      .status(201)
      .json({ message: "Adopcion updated successfully", adopcion });
  } catch (error) {
    next(error);
  }
};

export const deleteAdopcion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteAdopcion = await service.deleteAdopcion(Number(id));
    res
      .status(201)
      .json({ message: "Adopcion deleted successfully", deleteAdopcion });
  } catch (error) {
    next(error);
  }
};

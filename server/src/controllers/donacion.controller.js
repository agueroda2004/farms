import * as service from "../services/donacion.service.js";

export const createDonacion = async (req, res, next) => {
  try {
    const donacion = await service.createDonacion(req.body);
    res
      .status(201)
      .json({ message: "Donacion created successfully", donacion });
  } catch (error) {
    next(error);
  }
};

export const listDonaciones = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const donaciones = await service.listDonaciones(Number(granja_id));
    res.status(200).json(donaciones);
  } catch (error) {
    next(error);
  }
};

export const getDonacionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const donacion = await service.getDonacionById(Number(id));
    if (!donacion) {
      return res.status(404).json({ error: "Donacion not found." });
    }
    res.status(200).json(donacion);
  } catch (error) {
    next(error);
  }
};

export const updateDonacion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const donacion = await service.updateDonacion(Number(id), req.body);
    res
      .status(201)
      .json({ message: "Donacion updated successfully", donacion });
  } catch (error) {
    next(error);
  }
};

export const deleteDonacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteDonacion = await service.deleteDonacion(Number(id));
    res
      .status(201)
      .json({ message: "Donacion deleted successfully", deleteDonacion });
  } catch (error) {
    next(error);
  }
};

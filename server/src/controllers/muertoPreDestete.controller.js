import * as service from "../services/muertoPreDestete.service.js";
export const createMuertoPreDestete = async (req, res, next) => {
  try {
    const muertoPreDestete = await service.createMuertoPreDestete(req.body);
    res.status(201).json({
      message: "Muerto pre destete created successfully",
      muertoPreDestete,
    });
  } catch (error) {
    next(error);
  }
};

export const listMuertoPreDestete = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const muertosPreDestete = await service.listMuertoPreDestete(granja_id);
    res.status(200).json(muertosPreDestete);
  } catch (error) {
    next(error);
  }
};
export const getMuertoPreDesteteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const muertoPreDestete = await service.getMuertoPreDesteteById(id);
    if (!muertoPreDestete) {
      return res.status(404).json({ error: "Muerto pre destete not found." });
    }
    return res.status(200).json(muertoPreDestete);
  } catch (error) {
    next(error);
  }
};
export const updateMuertoPreDestete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedMuertoPreDestete = await service.updateMuertoPreDestete(
      id,
      req.body
    );
    res.status(201).json({
      message: "Muerto pre destete updated successfully",
      muertoPreDestete: updatedMuertoPreDestete,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMuertoPreDestete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedMuertoPreDestete = await service.deleteMuertoPreDestete(id);
    res.status(200).json({
      message: "Muerto pre destete deleted successfully",
      deletedMuertoPreDestete,
    });
  } catch (error) {
    next(error);
  }
};

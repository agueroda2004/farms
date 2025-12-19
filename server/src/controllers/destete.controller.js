import * as service from "../services/destete.service.js";

export const createDestete = async (req, res, next) => {
  try {
    const destete = await service.createDestete(req.body);
    res.status(201).json({ message: "Destete created successfully", destete });
  } catch (error) {
    next(error);
  }
};

export const listDestetes = async (req, res, next) => {
  try {
    const destetes = await service.listDestetes();
    res.status(200).json({ destetes });
  } catch (error) {
    next(error);
  }
};

export const getDesteteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const destete = await service.getDesteteById(Number(id));
    if (!destete) {
      return res.status(404).json({ error: "Destete not found." });
    }
    res.status(200).json({ destete });
  } catch (error) {
    next(error);
  }
};

export const updateDestete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedDestete = await service.updateDestete(Number(id), req.body);
    res.status(201).json({
      message: "Destete updated successfully",
      destete: updatedDestete,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDestete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedDestete = await service.deleteDestete(Number(id));
    res.status(201).json({
      message: "Destete deleted successfully",
      destete: deletedDestete,
    });
  } catch (error) {
    next(error);
  }
};

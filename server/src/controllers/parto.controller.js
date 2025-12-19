import * as service from "../services/parto.service.js";

export const createParto = async (req, res, next) => {
  try {
    const parto = await service.createParto(req.body);
    res.status(201).json({ message: "Parto created successfully.", parto });
  } catch (error) {
    next(error);
  }
};

export const listPartos = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const partos = await service.listPartos(Number(granja_id));

    res.status(200).json(partos);
  } catch (error) {
    next(error);
  }
};

export const getPartoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parto = await service.getPartoById(Number(id));
    if (!parto) {
      return res.status(404).json({ message: "Parto not found." });
    }
    res.status(200).json(parto);
  } catch (error) {
    next(error);
  }
};

export const updateParto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedParto = await service.updateParto(Number(id), req.body);
    res
      .status(201)
      .json({ message: "Parto updated successfully.", updatedParto });
  } catch (error) {
    next(error);
  }
};

export const deleteParto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedParto = await service.deleteParto(Number(id));
    res
      .status(201)
      .json({ message: "Parto deleted successfully.", deletedParto });
  } catch (error) {
    next(error);
  }
};

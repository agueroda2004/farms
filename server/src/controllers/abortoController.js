import * as service from "../services/abortoService.js";

export const createAborto = async (req, res, next) => {
  try {
    const data = req.body;

    const aborto = await service.createAborto(data);
    res.status(201).json({ message: "Aborto created successfully", aborto });
  } catch (error) {
    next(error);
  }
};

export const listAbortos = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const abortos = await service.listAbortosByGranja(Number(granja_id));

    res.status(200).json(abortos);
  } catch (error) {
    next(error);
  }
};

export const getAbortoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const aborto = await service.getAbortoById(Number(id));
    if (!aborto) {
      return res.status(404).json({ error: "Aborto not found." });
    }
    res.status(200).json(aborto);
  } catch (error) {
    next(error);
  }
};

export const updateAborto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const aborto = await service.updateAborto(Number(id), req.body);
    res.status(201).json({ message: "Aborto updated successfully", aborto });
  } catch (error) {
    next(error);
  }
};

export const deleteAborto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteAborto = await service.deleteAborto(Number(id));
    res
      .status(201)
      .json({ message: "Aborto deleted successfully", deleteAborto });
  } catch (error) {
    next(error);
  }
};

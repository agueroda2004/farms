import * as service from "../services/servicio.service.js";

export const createServicio = async (req, res) => {
  try {
    const servicio = await service.createServicio(req.body);
    res
      .status(201)
      .json({ message: "Servicio created successfully.", servicio });
  } catch (error) {
    next(error);
  }
};

export const updateServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedServicio = await service.updateServicio(Number(id), req.body);
    res
      .status(201)
      .json({ message: "Servicio updated successfully.", updatedServicio });
  } catch (error) {
    next(error);
  }
};

export const deleteServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedServicio = await service.deleteServicio(Number(id));
    res
      .status(201)
      .json({ message: "Servicio deleted successfully.", deletedServicio });
  } catch (error) {
    next(error);
  }
};

export const getServicioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servicio = await service.getServicioById(Number(id));

    if (!servicio) {
      return res.status(404).json({ message: "Servicio not found." });
    }
    res.status(200).json(servicio);
  } catch (error) {
    next(error);
  }
};

export const listServicios = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const servicios = await service.getAllServicios(Number(granja_id));

    res.status(200).json(servicios);
  } catch (error) {
    next(error);
  }
};

import * as service from "../services/servicio.service.js";
import { successResponse } from "../utils/response.js";

export const createServicio = async (req, res) => {
  try {
    const servicio = await service.createServicio(
      req.body,
      Number(req.user.granja_id)
    );
    successResponse(res, req, 201, "SERVICIO_CREATED", servicio);
  } catch (error) {
    next(error);
  }
};

export const updateServicio = async (req, res, next) => {
  try {
    const updatedServicio = await service.updateServicio(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );
    successResponse(res, req, 200, "SERVICIO_UPDATED", updatedServicio);
  } catch (error) {
    next(error);
  }
};

export const deleteServicio = async (req, res, next) => {
  try {
    const deletedServicio = await service.deleteServicio(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "SERVICIO_DELETED", deletedServicio);
  } catch (error) {
    next(error);
  }
};

export const getServicioById = async (req, res, next) => {
  try {
    const servicio = await service.getServicioById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );

    successResponse(res, req, 200, "SERVICIO_FETCHED", servicio);
  } catch (error) {
    next(error);
  }
};

export const listServicios = async (req, res, next) => {
  try {
    const servicios = await service.getAllServicios(Number(req.user.granja_id));

    successResponse(res, req, 200, "SERVICIOS_LISTED", servicios);
  } catch (error) {
    next(error);
  }
};

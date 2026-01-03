import * as service from "../services/donacion.service.js";
import { successResponse } from "../utils/response.js";

export const createDonacion = async (req, res, next) => {
  try {
    const donacion = await service.createDonacion(
      req.body,
      Number(req.user.granja_id)
    );
    successResponse(res, req, 201, "DONACION_CREATED", donacion);
  } catch (error) {
    next(error);
  }
};

export const listDonaciones = async (req, res, next) => {
  try {
    const donaciones = await service.listDonaciones(Number(req.user.granja_id));
    successResponse(res, req, 200, "DONACION_LISTED", donaciones);
  } catch (error) {
    next(error);
  }
};

export const getDonacionById = async (req, res, next) => {
  try {
    const donacion = await service.getDonacionById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );

    successResponse(res, req, 200, "DONACION_FETCHED", donacion);
  } catch (error) {
    next(error);
  }
};

export const updateDonacion = async (req, res, next) => {
  try {
    const donacion = await service.updateDonacion(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );
    successResponse(res, req, 201, "DONACION_UPDATED", donacion);
  } catch (error) {
    next(error);
  }
};

export const deleteDonacion = async (req, res, next) => {
  try {
    const deleteDonacion = await service.deleteDonacion(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 201, "DONACION_DELETED", deleteDonacion);
  } catch (error) {
    next(error);
  }
};

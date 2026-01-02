import * as service from "../services/adopcion.service.js";
import { successResponse } from "../utils/response.js";

export const createAdopcion = async (req, res, next) => {
  try {
    const adopcion = await service.createAdopcion(
      req.body,
      Number(req.user.granja_id)
    );
    successResponse(res, req, 201, "ADOPCION_CREATED", adopcion);
  } catch (error) {
    next(error);
  }
};

export const listAdopciones = async (req, res, next) => {
  try {
    const adopciones = await service.listAdopciones(Number(req.user.granja_id));
    successResponse(res, req, 200, "ADOPCIONES_LISTED", adopciones);
  } catch (error) {
    next(error);
  }
};

export const getAdopcionById = async (req, res, next) => {
  try {
    const adopcion = await service.getAdopcionById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );

    successResponse(res, req, 200, "ADOPCION_FETCHED", adopcion);
  } catch (error) {
    next(error);
  }
};

export const updateAdopcion = async (req, res, next) => {
  try {
    const adopcion = await service.updateAdopcion(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );
    successResponse(res, req, 200, "ADOPCION_UPDATED", adopcion);
  } catch (error) {
    next(error);
  }
};

export const deleteAdopcion = async (req, res, next) => {
  try {
    const deleteAdopcion = await service.deleteAdopcion(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "ADOPCION_DELETED", deleteAdopcion);
  } catch (error) {
    next(error);
  }
};

import * as service from "../services/parto.service.js";
import { successResponse } from "../utils/response.js";

export const createParto = async (req, res, next) => {
  try {
    const parto = await service.createParto(
      req.body,
      Number(req.user.granja_id)
    );
    successResponse(res, req, 201, "PARTO_CREATED", parto);
  } catch (error) {
    next(error);
  }
};

export const listPartos = async (req, res, next) => {
  try {
    const partos = await service.listPartos(Number(req.user.granja_id));

    successResponse(res, req, 200, "PARTOS_LISTED", partos);
  } catch (error) {
    next(error);
  }
};

export const getPartoById = async (req, res, next) => {
  try {
    const parto = await service.getPartoById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "PARTO_FETCHED", parto);
  } catch (error) {
    next(error);
  }
};

export const updateParto = async (req, res, next) => {
  try {
    const updatedParto = await service.updateParto(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );
    successResponse(res, req, 200, "PARTO_UPDATED", updatedParto);
  } catch (error) {
    next(error);
  }
};

export const deleteParto = async (req, res, next) => {
  try {
    const deletedParto = await service.deleteParto(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "PARTO_DELETED", deletedParto);
  } catch (error) {
    next(error);
  }
};

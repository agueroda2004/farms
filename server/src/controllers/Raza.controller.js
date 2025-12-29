import * as service from "../services/raza.service.js";
import { successResponse } from "../utils/response.js";

export const createRaza = async (req, res, next) => {
  try {
    const raza = await service.createRaza(req.body, req.user.granja_id);
    successResponse(res, req, 200, "RAZA_CREATED", raza);
  } catch (error) {
    next(error);
  }
};

export const listRazas = async (req, res, next) => {
  try {
    const razas = await service.listRazas(Number(req.user.granja_id));
    successResponse(res, req, 200, "RAZAS_LISTED", razas);
  } catch (error) {
    next(error);
  }
};

export const getRazaById = async (req, res, next) => {
  try {
    const raza = await service.getRazaById(
      Number(req.params.id),
      req.user.granja_id
    );
    successResponse(res, req, 200, "RAZA_FETCHED", raza);
  } catch (error) {
    next(error);
  }
};

export const updateRaza = async (req, res, next) => {
  try {
    const raza = await service.updateRaza(
      Number(req.params.id),
      req.user.granja_id,
      req.body
    );
    successResponse(res, req, 200, "RAZA_UPDATED", raza);
  } catch (error) {
    next(error);
  }
};

export const deleteRaza = async (req, res, next) => {
  try {
    const raza = await service.deleteRaza(
      Number(req.params.id),
      req.user.granja_id
    );
    successResponse(res, req, 200, "RAZA_DELETED", raza);
  } catch (error) {
    next(error);
  }
};

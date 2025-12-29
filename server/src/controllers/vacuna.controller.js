import * as service from "../services/vacuna.service.js";
import { successResponse } from "../utils/response.js";

export const createVacuna = async (req, res, next) => {
  try {
    const vacuna = await service.createVacuna(
      req.body,
      Number(req.user.granja_id)
    );
    successResponse(res, req, 201, "VACUNA_CREATED", vacuna);
  } catch (error) {
    next(error);
  }
};

export const listVacunas = async (req, res, next) => {
  try {
    const vacunas = await service.listVacunas(Number(req.user.granja_id));
    successResponse(res, req, 200, "VACUNA_LISTED", vacunas);
  } catch (error) {
    next(error);
  }
};

export const getVacunaById = async (req, res, next) => {
  try {
    const vacuna = await service.getVacunaById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "VACUNA_FETCHED", vacuna);
  } catch (error) {
    next(error);
  }
};

export const updateVacuna = async (req, res, next) => {
  try {
    const vacuna = await service.updateVacuna(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );
    successResponse(res, req, 201, "VACUNA_UPDATED", vacuna);
  } catch (error) {
    next(error);
  }
};

export const deleteVacuna = async (req, res, next) => {
  try {
    const vacuna = await service.deleteVacuna(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "VACUNA_DELETED", vacuna);
  } catch (error) {
    next(error);
  }
};

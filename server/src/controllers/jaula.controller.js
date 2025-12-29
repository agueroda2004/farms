import * as service from "../services/jaula.service.js";
import { successResponse } from "../utils/response.js";

export const createJaula = async (req, res, next) => {
  try {
    const jaula = await service.createJaula(req.body, req.user.granja_id);
    successResponse(res, req, 200, "JAULA_CREATED", jaula);
  } catch (error) {
    next(error);
  }
};

export const listJaulas = async (req, res, next) => {
  try {
    const jaulas = await service.listJaulas(req.user.granja_id);
    successResponse(res, req, 200, "JAULAS_LISTED", jaulas);
  } catch (error) {
    next(error);
  }
};

export const getJaulaById = async (req, res, next) => {
  try {
    const jaula = await service.getJaulaById(
      Number(req.params.id),
      req.user.granja_id
    );
    successResponse(res, req, 200, "JAULA_FETCHED", jaula);
  } catch (error) {
    next(error);
  }
};
export const updateJaula = async (req, res, next) => {
  try {
    const jaulaUpdated = await service.updateJaula(
      Number(req.params.id),
      req.user.granja_id,
      req.body
    );
    successResponse(res, req, 200, "JAULA_UPDATED", jaulaUpdated);
  } catch (error) {
    next(error);
  }
};
export const deleteJaula = async (req, res, next) => {
  try {
    const jaulaDeleted = await service.deleteJaula(
      Number(req.params.id),
      req.user.granja_id
    );
    successResponse(res, req, 200, "JAULA_DELETED", jaulaDeleted);
  } catch (error) {
    next(error);
  }
};

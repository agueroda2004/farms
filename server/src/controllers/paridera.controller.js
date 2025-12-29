import * as service from "../services/paridera.service.js";
import { successResponse } from "../utils/response.js";

export const createParidera = async (req, res, next) => {
  try {
    const paridera = await service.createParidera(
      req.body,
      Number(req.user.granja_id)
    );
    successResponse(res, req, 201, "PARIDERA_CREATED", paridera);
  } catch (error) {
    next(error);
  }
};
export const listParideras = async (req, res, next) => {
  try {
    const parideras = await service.listParideras(Number(req.user.granja_id));

    successResponse(res, req, 200, "PARIDERAS_LISTED", parideras);
  } catch (error) {
    next(error);
  }
};

export const getParideraById = async (req, res, next) => {
  try {
    const paridera = await service.getParideraById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "PARIDERA_FETCHED", paridera);
  } catch (error) {
    next(error);
  }
};

export const updateParidera = async (req, res, next) => {
  try {
    const paridera = await service.updateParidera(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );
    successResponse(res, req, 200, "PARIDERA_UPDATED", paridera);
  } catch (error) {
    next(error);
  }
};

export const deleteParidera = async (req, res, next) => {
  try {
    const deletedParidera = await service.deleteParidera(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "PARIDERA_DELETED", deletedParidera);
  } catch (error) {
    next(error);
  }
};

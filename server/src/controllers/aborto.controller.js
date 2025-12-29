import * as service from "../services/aborto.service.js";
import { successResponse } from "../utils/response.js";

export const createAborto = async (req, res, next) => {
  try {
    const aborto = await service.createAborto(
      req.body,
      Number(req.user.granja_id)
    );
    successResponse(res, req, 201, "ABORTO_CREATED", aborto);
  } catch (error) {
    next(error);
  }
};

export const listAbortos = async (req, res, next) => {
  try {
    const abortos = await service.listAbortos(Number(req.user.granja_id));

    successResponse(res, req, 200, "ABORTOS_LISTED", abortos);
  } catch (error) {
    next(error);
  }
};

export const getAbortoById = async (req, res, next) => {
  try {
    const aborto = await service.getAbortoById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "ABORTO_FETCHED", aborto);
  } catch (error) {
    next(error);
  }
};

export const updateAborto = async (req, res, next) => {
  try {
    const aborto = await service.updateAborto(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );
    successResponse(res, req, 201, "ABORTO_UPDATED", aborto);
  } catch (error) {
    next(error);
  }
};

export const deleteAborto = async (req, res, next) => {
  try {
    const deleteAborto = await service.deleteAborto(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "ABORTO_DELETED", deleteAborto);
  } catch (error) {
    next(error);
  }
};

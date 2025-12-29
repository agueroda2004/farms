export * as service from "../services/operario.service.js";
import { successResponse } from "../utils/response.js";

export const createOperario = async (req, res, next) => {
  try {
    const operario = await service.createOperario(
      req.body,
      Number(req.user.granja_id)
    );
    successResponse(res, req, 201, "OPERARIO_CREATED", operario);
  } catch (error) {
    next(error);
  }
};

export const listOperarios = async (req, res, next) => {
  try {
    const operarios = await service.listOperarios(Number(req.user.granja_id));

    successResponse(res, req, 200, "OPERARIOS_LISTED", operarios);
  } catch (error) {
    next(error);
  }
};

export const getOperarioById = async (req, res, next) => {
  try {
    const operario = await service.getOperarioById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );

    successResponse(res, req, 200, "OPERARIO_FETCHED", operario);
  } catch (error) {
    next(error);
  }
};

export const updateOperario = async (req, res, next) => {
  try {
    const updatedOperario = await service.updateOperario(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );

    successResponse(res, req, 201, "OPERARIO_UPDATED", updatedOperario);
  } catch (error) {
    next(error);
  }
};

export const deleteOperario = async (req, res, next) => {
  try {
    const deletedOperario = await service.deleteOperario(
      Number(req.params.id),
      Number(req.user.granja_id)
    );

    successResponse(res, req, 200, "OPERARIO_DELETED", deletedOperario);
  } catch (error) {
    next(error);
  }
};

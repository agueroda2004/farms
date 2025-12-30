import * as service from "../services/muertoPreDestete.service.js";
import { successResponse } from "../utils/response.js";

export const createMuertoPreDestete = async (req, res, next) => {
  try {
    const muertoPreDestete = await service.createMuertoPreDestete(
      req.body,
      Number(req.user.granja_id)
    );
    successResponse(
      req,
      res,
      201,
      "MUERTO_PRE_DESTETE_CREATED",
      muertoPreDestete
    );
  } catch (error) {
    next(error);
  }
};

export const listMuertoPreDestete = async (req, res, next) => {
  try {
    const muertosPreDestete = await service.listMuertoPreDestete(
      Number(req.user.granja_id)
    );
    successResponse(
      req,
      res,
      200,
      "MUERTO_PRE_DESTETE_LISTED",
      muertosPreDestete
    );
  } catch (error) {
    next(error);
  }
};
export const getMuertoPreDesteteById = async (req, res, next) => {
  try {
    const muertoPreDestete = await service.getMuertoPreDesteteById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(
      req,
      res,
      200,
      "MUERTO_PRE_DESTETE_FETCHED",
      muertoPreDestete
    );
  } catch (error) {
    next(error);
  }
};
export const updateMuertoPreDestete = async (req, res, next) => {
  try {
    const updatedMuertoPreDestete = await service.updateMuertoPreDestete(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );
    successResponse(
      req,
      res,
      200,
      "MUERTO_PRE_DESTETE_UPDATED",
      updatedMuertoPreDestete
    );
  } catch (error) {
    next(error);
  }
};

export const deleteMuertoPreDestete = async (req, res, next) => {
  try {
    const deletedMuertoPreDestete = await service.deleteMuertoPreDestete(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(
      req,
      res,
      200,
      "MUERTO_PRE_DESTETE_DELETED",
      deletedMuertoPreDestete
    );
  } catch (error) {
    next(error);
  }
};

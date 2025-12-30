import * as service from "../services/enfermedadPreDestete.service.js";
import { successResponse } from "../utils/response.js";

export const createEnfermedadPreDestete = async (req, res) => {
  try {
    const enfermedadPreDestete = await service.createEnfermedadPreDestete(
      req.body,
      Number(req.user.granja_id)
    );
    successResponse(
      res,
      req,
      201,
      "ENFERMEDAD_PRE_DESTETE_CREATED",
      enfermedadPreDestete
    );
  } catch (error) {
    next(error);
  }
};

export const listEnfermedadPreDestete = async (req, res, next) => {
  try {
    const enfermedadesPreDestete = await service.listEnfermedadPreDestete(
      Number(req.user.granja_id)
    );
    successResponse(
      res,
      req,
      200,
      "ENFERMEDAD_PRE_DESTETE_LISTED",
      enfermedadesPreDestete
    );
  } catch (error) {
    next(error);
  }
};

export const getEnfermedadPreDesteteById = async (req, res, next) => {
  try {
    const enfermedadPreDestete = await service.getEnfermedadPreDesteteById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(
      res,
      req,
      200,
      "ENFERMEDAD_PRE_DESTETE_FETCHED",
      enfermedadPreDestete
    );
  } catch (error) {
    next(error);
  }
};

export const updateEnfermedadPreDestete = async (req, res, next) => {
  try {
    const updatedEnfermedadPreDestete =
      await service.updateEnfermedadPreDestete(
        Number(req.params.id),
        Number(req.user.granja_id),
        req.body
      );
    successResponse(
      res,
      req,
      200,
      "ENFERMEDAD_PRE_DESTETE_UPDATED",
      updatedEnfermedadPreDestete
    );
  } catch (error) {
    next(error);
  }
};

export const deleteEnfermedadPreDestete = async (req, res, next) => {
  try {
    const deletedEnfermedadPreDestete =
      await service.deleteEnfermedadPreDestete(
        Number(req.params.id),
        Number(req.user.granja_id)
      );
    successResponse(
      res,
      req,
      200,
      "ENFERMEDAD_PRE_DESTETE_DELETED",
      deletedEnfermedadPreDestete
    );
  } catch (error) {
    next(error);
  }
};

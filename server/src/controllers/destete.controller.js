import * as service from "../services/destete.service.js";
import { successResponse } from "../utils/response.js";

export const createDestete = async (req, res, next) => {
  try {
    const destete = await service.createDestete(req.body, Number(req.user.id));
    successResponse(res, req, 201, "DESTETE_CREATED", destete);
  } catch (error) {
    next(error);
  }
};

export const listDestetes = async (req, res, next) => {
  try {
    const destetes = await service.listDestetes(Number(req.user.id));
    successResponse(res, req, 200, "DESTETES_LISTED", destetes);
  } catch (error) {
    next(error);
  }
};

export const getDesteteById = async (req, res, next) => {
  try {
    const destete = await service.getDesteteById(
      Number(req.params.id),
      Number(req.user.id)
    );

    successResponse(res, req, 200, "DESTETE_RETRIEVED", destete);
  } catch (error) {
    next(error);
  }
};

export const updateDestete = async (req, res, next) => {
  try {
    const updatedDestete = await service.updateDestete(
      Number(req.params.id),
      Number(req.user.id),
      req.body
    );
    successResponse(res, req, 200, "DESTETE_UPDATED", updatedDestete);
  } catch (error) {
    next(error);
  }
};

export const deleteDestete = async (req, res, next) => {
  try {
    const deletedDestete = await service.deleteDestete(
      Number(req.params.id),
      Number(req.user.id)
    );
    successResponse(res, req, 200, "DESTETE_DELETED", deletedDestete);
  } catch (error) {
    next(error);
  }
};

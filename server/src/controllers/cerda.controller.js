import * as service from "../services/cerda.service.js";
import { successResponse } from "../utils/response.js";

export const createCerda = async (req, res, next) => {
  try {
    const cerda = await service.createCerda(req.body, req.user.granja_id);
    successResponse(res, req, 200, "CERDA_CREATED", cerda);
  } catch (error) {
    next(error);
  }
};

export const listCerdas = async (req, res, next) => {
  try {
    const cerdas = await service.listCerdas(Number(req.user.granja_id));
    successResponse(res, req, 200, "CERDAS_LISTED", cerdas);
  } catch (error) {
    next(error);
  }
};

export const getCerdaById = async (req, res, next) => {
  try {
    const cerda = await service.getCerdaById(
      Number(req.params.id),
      req.user.granja_id
    );
    successResponse(res, req, 200, "CERDA_FETCHED", cerda);
  } catch (error) {
    next(error);
  }
};

export const updateCerda = async (req, res, next) => {
  try {
    const cerda = await service.updateCerda(
      Number(req.params.id),
      req.user.granja_id,
      req.body
    );
    successResponse(res, req, 200, "CERDA_UPDATED", cerda);
  } catch (error) {
    next(error);
  }
};

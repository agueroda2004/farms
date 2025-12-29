import * as service from "../services/cerdaRemovida.service.js";
import { successResponse } from "../utils/response.js";

export const createCerdaRemovida = async (req, res, next) => {
  try {
    const cerdaRemovida = await service.createCerdaRemovida(
      req.body,
      req.user.granja_id
    );
    successResponse(res, req, 200, "CERDA_REMOVIDA_CREATED", cerdaRemovida);
  } catch (error) {
    next(error);
  }
};

export const listCerdasRemovidas = async (req, res, next) => {
  try {
    const cerdasRemovidas = await service.listCerdasRemovidas(
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "CERDAS_REMOVIDAS_LISTED", cerdasRemovidas);
  } catch (error) {
    next(error);
  }
};

export const getCerdaRemovidaById = async (req, res, next) => {
  try {
    const cerdaRemovida = await service.getCerdaRemovidaById(
      Number(req.params.id),
      req.user.granja_id
    );
    successResponse(res, req, 200, "CERDA_REMOVIDA_FETCHED", cerdaRemovida);
  } catch (error) {
    next(error);
  }
};

export const updateCerdaRemovida = async (req, res, next) => {
  try {
    const cerdaRemovidaUpdated = await service.updateCerdaRemovida(
      Number(req.params.id),
      req.user.granja_id,
      req.body
    );

    successResponse(
      res,
      req,
      200,
      "CERDA_REMOVIDA_UPDATED",
      cerdaRemovidaUpdated
    );
  } catch (error) {
    next(error);
  }
};

export const deleteCerdaRemovida = async (req, res, next) => {
  try {
    const deleteCerdaRemovida = await service.deleteCerdaRemovida(
      Number(req.params.id),
      req.user.granja_id
    );
    successResponse(
      res,
      req,
      200,
      "CERDA_REMOVIDA_DELETED",
      deleteCerdaRemovida
    );
  } catch (error) {
    next(error);
  }
};

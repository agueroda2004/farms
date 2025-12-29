import * as service from "../services/berraco.service.js";
import { successResponse } from "../utils/response.js";

export const createBerraco = async (req, res, next) => {
  try {
    const berraco = await service.createBerraco(req.body, req.params.granja_id);
    successResponse(res, req, 201, "BERRACO_CREATED", berraco);
  } catch (error) {
    next(error);
  }
};

export const listBerracos = async (req, res, next) => {
  try {
    const berracos = await service.listBerracos(Number(req.user.granja_id));
    successResponse(res, req, 200, "BERRACOS_LISTED", berracos);
  } catch (error) {
    next(error);
  }
};

export const getBerracoById = async (req, res, next) => {
  try {
    const berraco = await service.getBerracoById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "BERRACO_FETCHED", berraco);
  } catch (error) {
    next(error);
  }
};

export const updateBerraco = async (req, res, next) => {
  try {
    const updatedBerraco = await service.updateBerraco(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );
    successResponse(res, req, 201, "BERRACO_UPDATED", updatedBerraco);
  } catch (error) {
    next(error);
  }
};

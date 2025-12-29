export * as service from "../services/berracoRemovido.service.js";
import { successResponse } from "../utils/response.js";

export const createBerracoRemovido = async (req, res, next) => {
  try {
    const berracoRemovido = await service.createBerracoRemovido(
      req.body,
      req.user.granja_id
    );
    successResponse(res, req, 201, "BERRACO_REMOVIDO_CREATED", berracoRemovido);
  } catch (error) {
    next(error);
  }
};

export const listBerracosRemovidos = async (req, res, next) => {
  try {
    const berracosRemovidos = await service.listBerracosRemovidos(
      Number(req.user.granja_id)
    );

    successResponse(
      res,
      req,
      200,
      "BERRACO_REMOVIDO_LISTED",
      berracosRemovidos
    );
  } catch (error) {
    next(error);
  }
};

export const getBerracoRemovidoById = async (req, res, next) => {
  try {
    const berracoRemovido = await service.getBerracoRemovidoById(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(res, req, 200, "BERRACO_REMOVIDO_FETCHED", berracoRemovido);
  } catch (error) {
    next(error);
  }
};

export const updateBerracoRemovido = async (req, res, next) => {
  try {
    const updatedBerracoRemovido = await service.updateBerracoRemovido(
      Number(req.params.id),
      Number(req.user.granja_id),
      req.body
    );

    successResponse(
      res,
      req,
      201,
      "BERRACO_REMOVIDO_UPDATED",
      updatedBerracoRemovido
    );
  } catch (error) {
    next(error);
  }
};

export const deleteBerracoRemovido = async (req, res, next) => {
  try {
    const deletedBerracoRemovido = await service.deleteBerracoRemovido(
      Number(req.params.id),
      Number(req.user.granja_id)
    );
    successResponse(
      res,
      req,
      200,
      "BERRACO_REMOVIDO_DELETED",
      deletedBerracoRemovido
    );
  } catch (error) {
    next(error);
  }
};

import * as service from "../services/cerdaRemovida.service.js";

export const createCerdaRemovida = async (req, res, next) => {
  try {
    const data = req.body;

    const cerdaRemovida = await service.createCerdaRemovida(data);
    res
      .status(201)
      .json({ message: "Cerda Removida created successfully.", cerdaRemovida });
  } catch (error) {
    next(error);
  }
};

export const listCerdasRemovidas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const cerdasRemovidas = await service.listCerdasRemovidas(
      Number(granja_id)
    );

    res.status(200).json(cerdasRemovidas);
  } catch (error) {
    next(error);
  }
};

export const getCerdaRemovidaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cerdaRemovida = await service.getCerdaRemovidaById(Number(id));
    if (!cerdaRemovida) {
      return res.status(404).json({ error: "Cerda removida not found." });
    }
    res.status(200).json(cerdaRemovida);
  } catch (error) {
    next(error);
  }
};

export const updateCerdaRemovida = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cerdaRemovidaUpdated = await service.updateCerdaRemovida(
      Number(id),
      req.body
    );

    res.status(200).json({
      message: "Cerda Removida updated successfully.",
      cerdaRemovidaUpdated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCerdaRemovida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteCerdaRemovida = await service.deleteCerdaRemovida(Number(id));
    res.status(200).json({
      message: "Cerda Removida deleted successfully.",
      deleteCerdaRemovida,
    });
  } catch (error) {
    next(error);
  }
};

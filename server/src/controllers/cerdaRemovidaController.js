import * as service from "../services/cerdaRemovida.js";
import * as serviceCerda from "../services/cerdaService.js";

import { Prisma } from "@prisma/client";

export const createCerdaRemovida = async (req, res, next) => {
  try {
    const data = req.body;

    const { cerdaRemovida, updateCerda } = await service.createCerdaRemovida(
      data
    );
    res.status(201).json({ cerdaRemovida, updateCerda });
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
    if (!cerdasRemovidas) {
      return res.status(404).json({ error: "No hay cerdas removidas." });
    }
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
      return res.status(404).json({ error: "Cerda removida no encontrada." });
    }
    res.status(200).json(cerdaRemovida);
  } catch (error) {
    next(error);
  }
};

export const updateCerdaRemovida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { causa, observacion, fecha, granja_id } = req.body;
    const dataToUpdate = {};

    if (causa !== undefined) dataToUpdate.causa = causa;
    if (observacion !== undefined) dataToUpdate.observacion = observacion;
    if (fecha !== undefined) dataToUpdate.fecha = fecha;
    if (granja_id !== undefined)
      dataToUpdate.granja = { connect: { id: Number(granja_id) } };

    const cerdaRemovida = await service.updateCerdaRemovida(
      Number(id),
      dataToUpdate
    );

    res.status(200).json(cerdaRemovida);
  } catch (error) {
    next(error);
  }
};

export const deleteCerdaRemovida = async (req, res, next) => {
  try {
    const data = req.body;
    const { deleteCerdaRemovida, updateCerda } =
      await service.deleteCerdaRemovida(data);
    res.status(200).json({ deleteCerdaRemovida, updateCerda });
  } catch (error) {
    next(error);
  }
};

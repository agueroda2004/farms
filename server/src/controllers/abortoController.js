import * as service from "../services/abortoService.js";

export const createAborto = async (req, res, next) => {
  try {
    const data = req.body;

    const { aborto, updateCerda } = await service.createAborto(data);
    res.status(201).json({ aborto, updateCerda });
  } catch (error) {
    next(error);
  }
};

export const listAbortosByGranja = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const abortos = await service.listAbortosByGranja(Number(granja_id));
    if (!abortos) {
      return res.status(404).json({ error: "No hay abortos." });
    }
    res.status(200).json(abortos);
  } catch (error) {
    next(error);
  }
};

export const getAbortoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const aborto = await service.getAbortoById(Number(id));
    if (!aborto) {
      return res.status(404).json({ error: "Aborto no encontrado." });
    }
    res.status(200).json(aborto);
  } catch (error) {
    next(error);
  }
};

export const updateAborto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fecha, observacion, granja_id, cerda_id } = req.body;
    const dataToUpdate = {};

    if (fecha !== undefined) dataToUpdate.fecha = fecha;
    if (observacion !== undefined) dataToUpdate.observacion = observacion;
    // ! Eliminar esto, granja_id siempre es obligatoria
    if (granja_id !== undefined)
      dataToUpdate.granja = { connect: { id: Number(granja_id) } };
    // ! Eliminar esto, cerda_id siempre es obligatoria
    if (cerda_id !== undefined)
      dataToUpdate.cerda = { connect: { id: Number(cerda_id) } };

    const aborto = await service.updateAborto(Number(id), dataToUpdate);
    res.status(200).json(aborto);
  } catch (error) {
    next(error);
  }
};

export const deleteAborto = async (req, res, next) => {
  try {
    const data = req.body;
    const { deleteAborto, updateCerda } = await service.deleteAborto(data);
    res.status(200).json({ deleteAborto, updateCerda });
  } catch (error) {
    next(error);
  }
};

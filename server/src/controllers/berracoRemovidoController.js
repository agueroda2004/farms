export * as service from "../services/berracoService.js";

export const createBerracoRemovido = async (req, res, next) => {
  try {
    const data = req.body;
    const berracoRemovido = await service.createBerracoRemovido(data);
    res.status(201).json(berracoRemovido);
  } catch (error) {
    next(error);
  }
};

export const listBerracosRemovidosByGranja = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const berracosRemovidos = await service.listBerracosRemovidosByGranja(
      Number(granja_id)
    );
    if (!berracosRemovidos) {
      return res.status(404).json({ error: "No hay berracos removidos." });
    }
    res.json(berracosRemovidos);
  } catch (error) {
    next(error);
  }
};

export const getBerracoRemovidoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const berracoRemovido = await service.getBerracoById(Number(id));
    if (!berracoRemovido) {
      return res.status(404).json({ error: "Berraco removido no encontrado." });
    }
    res.json(berracoRemovido);
  } catch (error) {
    next(error);
  }
};

export const updateBerracoRemovido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { causa, observacion, fecha, granja_id, berraco_id } = req.body;
    const dataToUpdate = { granja_id, berraco_id };
    if (causa !== undefined) dataToUpdate.causa = causa;
    if (observacion !== undefined) dataToUpdate.observacion = observacion;
    if (fecha !== undefined) dataToUpdate.fecha = fecha;

    const updatedBerracoRemovido = await service.updateBerracoRemovido(
      Number(id),
      dataToUpdate
    );
    res.json(updatedBerracoRemovido);
  } catch (error) {
    next(error);
  }
};

export const deleteBerracoRemovido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBerracoRemovido = await service.deleteBerracoRemovido(
      Number(id)
    );
    res.json(deletedBerracoRemovido);
  } catch (error) {
    next(error);
  }
};

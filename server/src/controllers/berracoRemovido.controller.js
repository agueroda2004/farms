export * as service from "../services/berracoRemovido.service.js";

export const createBerracoRemovido = async (req, res, next) => {
  try {
    const data = req.body;
    const berracoRemovido = await service.createBerracoRemovido(data);
    res.status(201).json({
      message: "Berraco removido created successfully.",
      berracoRemovido,
    });
  } catch (error) {
    next(error);
  }
};

export const listBerracosRemovidos = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const berracosRemovidos = await service.listBerracosRemovidos(
      Number(granja_id)
    );

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
      return res.status(404).json({ error: "Berraco removido not found." });
    }
    res.json(berracoRemovido);
  } catch (error) {
    next(error);
  }
};

export const updateBerracoRemovido = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedBerracoRemovido = await service.updateBerracoRemovido(
      Number(id),
      req.body
    );

    res.status(201).json({
      message: "Berraco removido updated successfully.",
      updatedBerracoRemovido,
    });
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
    res.status(201).json({
      message: "Berraco removido deleted successfully.",
      deletedBerracoRemovido,
    });
  } catch (error) {
    next(error);
  }
};

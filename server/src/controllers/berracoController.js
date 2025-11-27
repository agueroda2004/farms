import * as service from "../services/berracoService.js";
import { Prisma } from "@prisma/client";

export const createBerraco = async (req, res, next) => {
  try {
    const data = req.body;
    const berraco = await service.createBerraco(data);
    res.status(201).json(berraco);
  } catch (error) {
    next(error);
  }
};

export const listBerracosByGranja = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const berracos = await service.listBerracosByGranja(Number(granja_id));
    if (!berracos) {
      return res.status(404).json({ error: "No hay berracos." });
    }
    res.status(200).json(berracos);
  } catch (error) {
    next(error);
  }
};

export const getBerracoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const berraco = await service.getBerracoById(Number(id));
    if (!berraco) {
      return res.status(404).json({ error: "Berraco no encontrado." });
    }
    res.status(200).json(berraco);
  } catch (error) {
    next(error);
  }
};

export const updateBerraco = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      observacion,
      condicion,
      activo,
      granja_id,
      raza_id,
      jaula_id,
    } = req.body;
    const dataToUpdate = { granja_id };

    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (observacion !== undefined) dataToUpdate.observacion = observacion;
    if (condicion !== undefined) dataToUpdate.condicion = condicion;
    if (activo !== undefined) dataToUpdate.activo = activo;
    if (raza_id !== undefined)
      dataToUpdate.raza = { connect: { id: Number(raza_id) } };
    if (jaula_id !== undefined)
      dataToUpdate.jaula = { connect: { id: Number(jaula_id) } };
    const updatedBerraco = await service.updateBerraco(
      Number(id),
      dataToUpdate
    );
    res.status(200).json(updatedBerraco);
  } catch (error) {
    next(error);
  }
};

export const deleteBerraco = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBerraco = await service.deleteBerraco(Number(id));
    res
      .status(200)
      .json({ message: "Berraco eliminado correctamente", deletedBerraco });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const berracoDesactivado = await service.updateBerraco(Number(id), {
          activo: false,
        });
        return res.json({
          message:
            "El berraco no se puede eliminar porque está relacionado con otros registros. Ha sido desactivado en su lugar.",
          berracoDesactivado,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

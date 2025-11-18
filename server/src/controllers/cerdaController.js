import * as service from "../services/cerdaService.js";
import { Prisma } from "@prisma/client";

// ✅
export const createCerda = async (req, res, next) => {
  try {
    const {
      nombre,
      paridad,
      fecha_ingreso,
      observacion,
      granja_id,
      raza_id,
      jaula_id,
    } = req.body;

    const cerda = await service.createCerda({
      nombre,
      paridad: Number(paridad),
      fecha_ingreso,
      observacion,
      granja: { connect: { id: Number(granja_id) } },
      raza: { connect: { id: Number(raza_id) } },
      jaula: { connect: { id: Number(jaula_id) } },
    });

    res.status(201).json(cerda);
  } catch (error) {
    next(error);
  }
};

export const listCerdasActivas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const cerdas = await service.listCerdasActivas(Number(granja_id));
    if (!cerdas) {
      return res.status(404).json({ error: "No hay cerdas activas." });
    }
    res.json(cerdas);
  } catch (error) {
    next(error);
  }
};

export const listCerdas = async (req, res, next) => {
  try {
    const { granja_id } = req.params;
    const cerdas = await service.listCerdas(Number(granja_id));
    if (!cerdas) {
      return res.status(404).json({ error: "No hay cerdas." });
    }
    res.json(cerdas);
  } catch (error) {
    next(error);
  }
};

export const getCerdaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cerda = await service.getCerdaById(Number(id));
    if (!cerda) return res.status(404).json({ error: "Cerda no encontrada." });

    res.json(cerda);
  } catch (error) {
    next(error);
  }
};

export const updateCerda = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      paridad,
      fecha_ingreso,
      observacion,
      granja_id,
      raza_id,
      jaula_id,
      activo,
    } = req.body;

    const dataToUpdate = {};
    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (paridad !== undefined) dataToUpdate.paridad = Number(paridad);
    if (fecha_ingreso !== undefined) dataToUpdate.fecha_ingreso = fecha_ingreso;
    if (observacion !== undefined) dataToUpdate.observacion = observacion;
    if (granja_id !== undefined) dataToUpdate.granja_id = granja_id;
    if (raza_id !== undefined) dataToUpdate.raza_id = raza_id;
    if (jaula_id !== undefined) dataToUpdate.jaula_id = jaula_id;
    if (activo !== undefined) dataToUpdate.activo = activo;

    const cerda = await service.updateCerda(Number(id), dataToUpdate);
    res.json({
      message: `Éxito al actualizar la cerda ${cerda.nombre}`,
      cerda,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCerda = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cerda = await service.getCerdaById(Number(id));
    if (!cerda) {
      return res.status(404).json({ error: "Cerda no encontrada." });
    }

    await service.deleteCerda(Number(id));
    res.json({ message: "Cerda eliminada exitosamente." });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      try {
        const cerdaDesactivada = await service.updateCerda(Number(id), {
          activo: false,
        });
        return res.json({
          message: `La cerda tenía registros asociados y no pudo ser eliminada. Se ha desactivado la cerda ${cerdaDesactivada.nombre} exitosamente.`,
          cerda: cerdaDesactivada,
        });
      } catch (updateError) {
        return next(updateError);
      }
    }
    next(error);
  }
};

import * as service from "../services/cerdaService.js";
import { Prisma } from "@prisma/client";

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
      granja_id: { connect: { id: Number(granja_id) } },
      raza_id: { connect: { id: Number(raza_id) } },
      jaula_id: { connect: { id: Number(jaula_id) } },
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
    const userGranjaId = req.user.granjaId;

    const { id } = req.params;
    const cerda = await service.getCerdaById(Number(id));
    if (!cerda) return res.status(404).json({ error: "Cerda no encontrada." });

    if (cerda.granja_id !== userGranjaId) {
      return res.status(403).json({
        error: "Acceso denegado. Esta cerda no pertenece a tu granja.",
      });
    }
    res.json(cerda);
  } catch (error) {
    next(error);
  }
};

export const updateCerda = async (req, res, next) => {
  try {
    const userGranjaId = req.user.granjaId;

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

    if (Number(granja_id) !== userGranjaId) {
      return res.status(403).json({
        error:
          "Acceso denegado. No puedes modificar una cerda fuera de tu granja.",
      });
    }
    const cerda = await service.updateCerda(Number(id), {
      nombre,
      paridad: Number(paridad),
      fecha_ingreso,
      observacion,
      granja_id: { connect: { id: Number(granja_id) } },
      raza_id: { connect: { id: Number(raza_id) } },
      jaula_id: { connect: { id: Number(jaula_id) } },
      activo,
    });
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
    const userGranjaId = req.user.granjaId;
    const { id } = req.params;

    const cerda = await service.getCerdaById(Number(id));
    if (!cerda) {
      return res.status(404).json({ error: "Cerda no encontrada." });
    }

    if (cerda.granja_id !== userGranjaId) {
      return res.status(403).json({
        error:
          "Acceso denegado. No puedes eliminar una cerda fuera de tu granja.",
      });
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

import prisma from "../prismaClient";
import { AppError } from "../errors/appError.js";

export const createAborto = async (data, granja_id) => {
  const { fecha, hora, observacion, cerda_id } = data;

  const cerda = await validateCerda(cerda_id, granja_id);

  await validateServicio(cerda.id, fecha);

  const [aborto] = await prisma.$transaction([
    prisma.aborto.create({
      data: {
        fecha,
        hora,
        observacion,
        granja: { connect: { id: granja_id } },
        cerda: { connect: { id: cerda.id } },
        jaula: { connect: { id: cerda.jaula_id } },
        condicion_anterior: cerda.condicion,
      },
    }),
    prisma.cerda.update({
      where: { id: cerda.id },
      data: {
        condicion: "aborto",
      },
    }),
  ]);
  return aborto;
};

export const listAbortos = async (granja_id) => {
  return await prisma.aborto.findMany({
    where: { granja_id: granja_id },
  });
};

export const getAbortoById = async (id, granja_id) => {
  return await prisma.aborto.findFirst({
    where: { id: id, granja_id: granja_id },
  });
};

export const updateAborto = async (id, granja_id, data) => {
  const { fecha, hora, observacion } = data;
  const dataToUpdate = {};

  const aborto = await validateAbortoExists(id, granja_id);

  if (fecha !== undefined) {
    await validateServicio(aborto.cerda_id, fecha);
    dataToUpdate.fecha = fecha;
  }

  if (hora !== undefined) {
    dataToUpdate.hora = hora;
  }

  if (observacion !== undefined) {
    dataToUpdate.observacion = observacion;
  }

  return await prisma.aborto.update({ where: { id: id }, data: dataToUpdate });
};

export const deleteAborto = async (id, granja_id) => {
  const aborto = await validateAbortoExists(id, granja_id);

  const [deleteAborto, ..._] = await prisma.$transaction([
    prisma.aborto.delete({ where: { id: id } }),
    prisma.cerda.update({
      where: { id: aborto.cerda_id, granja_id: granja_id },
      data: {
        estado: aborto.condicion_anterior,
        jaula_id: null,
      },
    }),
  ]);

  return deleteAborto;
};

const validateCerda = async (cerda_id, granja_id) => {
  const cerda = await prisma.cerda.findFirst({
    where: { id: cerda_id, granja_id: granja_id, activo: true },
  });
  if (!cerda) {
    throw new AppError("CERDA_NOT_FOUND");
  }
  if (cerda.condicion !== "gestando") {
    throw new AppError("CERDA_NOT_GESTATING");
  }
  return cerda;
};

const validateServicio = async (cerda_id, fecha) => {
  const servicio = await prisma.servicio.findFirst({
    where: {
      cerda_id: cerda_id,
    },
    include: { montas: true },
    orderBy: { fecha: "desc" },
  });

  if (!servicio) {
    throw new AppError("SERVICIO_NOT_FOUND", 404);
  }

  if (servicio.montas[0].fecha > fecha) {
    throw new AppError("SERVICIO_DATE_INVALID", 400);
  }
};

const validateAbortoExists = async (id, granja_id) => {
  const aborto = await prisma.aborto.findFirst({
    where: { id: id, granja_id: granja_id },
  });
  if (!aborto) {
    throw new AppError("ABORTO_NOT_FOUND", 404);
  }
  return aborto;
};

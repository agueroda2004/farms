import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createBerracoRemovido = async (data) => {
  const { causa, observacion, fecha, granja_id, berraco_id } = data;

  const berraco = await validateBerracoExists(berraco_id, granja_id);
  await validateMontaDates(berraco_id, fecha);

  const [berracoRemovido, ..._] = await prisma.$transaction([
    prisma.berraco_Removido.create({
      data: {
        causa,
        condicion_anterior: berraco.condicion,
        observacion,
        fecha,
        granja: { connect: { id: Number(granja_id) } },
        berraco: { connect: { id: Number(berraco_id) } },
      },
    }),
    prisma.berraco.update({
      where: { id: Number(berraco_id) },
      data: {
        jaula_id: null,
        condicion: causa,
        activo: false,
      },
    }),
  ]);

  return berracoRemovido;
};

export const listBerracosRemovidos = async (granja_id) => {
  return await prisma.berraco_Removido.findMany({
    where: { granja_id: granja_id },
  });
};

export const getBerracoRemovidoById = async (id, granja_id) => {
  return await prisma.berraco_Removido.findFirst({
    where: { id: id, granja_id: granja_id },
  });
};

export const updateBerracoRemovido = async (id, granja_id, data) => {
  const { causa, observacion, fecha } = data;
  const dataToUpdate = {};

  const berracoRemovido = await validateBerracoRemovidoExists(id, granja_id);

  if (causa !== undefined) dataToUpdate.causa = causa;

  if (observacion !== undefined) dataToUpdate.observacion = observacion;

  if (fecha !== undefined) {
    await validateMontaDates(berracoRemovido.berraco_id, fecha);
    dataToUpdate.fecha = fecha;
  }

  return await prisma.berraco_Removido.update({
    where: { id: berracoRemovido.id, granja_id: Number(granja_id) },
    data: dataToUpdate,
  });
};

export const deleteBerracoRemovido = async (id, granja_id) => {
  const berracoRemovido = await validateBerracoRemovidoExists(id, granja_id);

  const [deleteBerracoRemovido, ..._] = await prisma.$transaction([
    prisma.berraco_Removido.delete({ where: { id: id } }),
    prisma.berraco.update({
      where: { id: berracoRemovido.berraco_id },
      data: {
        condicion: berracoRemovido.condicion_anterior,
        activo: true,
        jaula_id: null,
      },
    }),
  ]);
  return deleteBerracoRemovido;
};

const validateBerracoExists = async (id, granja_id) => {
  const berraco = await prisma.berraco.findFirst({
    where: { id: Number(id), granja_id: Number(granja_id) },
  });
  if (!berraco) {
    throw new AppError("BERRACO_NOT_FOUND", 404);
  }
  return berraco;
};

const validateMontaDates = async (id, fecha) => {
  const montas = await prisma.monta.findMany({
    where: { berraco_id: id },
    orderBy: { fecha: "desc" },
    take: 1,
  });
  if (montas.length > 0 && montas[0].fecha > fecha) {
    throw new AppError("BERRACO_REMOVIDO_DATE_INVALID", 400);
  }
  return true;
};

const validateBerracoRemovidoExists = async (id, granja_id) => {
  const berracoRemovido = await prisma.berraco_Removido.findFirst({
    where: { id: id, granja_id: Number(granja_id) },
  });
  if (!berracoRemovido) {
    throw new AppError("BERRACO_REMOVIDO_NOT_FOUND", 404);
  }
  return berracoRemovido;
};

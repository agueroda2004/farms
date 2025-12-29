import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createBerraco = async (data, granja_id) => {
  const { nombre, observacion, raza_id, jaula_id, fecha } = data;

  await validateJaula(jaula_id, granja_id);
  await validateBerracoName(nombre, granja_id);
  await validateRaza(raza_id, granja_id);

  const berraco = await prisma.berraco.create({
    data: {
      nombre,
      fecha_ingreso: fecha,
      observacion,
      granja: { connect: { id: Number(granja_id) } },
      raza: { connect: { id: Number(raza_id) } },
      jaula: { connect: { id: Number(jaula_id) } },
    },
  });
  return berraco;
};

export const listBerracos = async (granja_id) => {
  return await prisma.berraco.findMany({
    where: { granja_id: Number(granja_id) },
  });
};

export const getBerracoById = async (id, granja_id) => {
  return await validateBerracoExists(id, granja_id);
};

export const updateBerraco = async (id, granja_id, data) => {
  const { activo, fecha, observacion, jaula_id, raza_id } = data;
  const dataToUpdate = {};

  await validateBerracoExists(id, granja_id);

  if (activo !== undefined) dataToUpdate.activo = activo;

  if (fecha !== undefined) {
    await validateMontaDates(id, fecha);

    dataToUpdate.fecha_ingreso = fecha;
  }
  if (observacion !== undefined) dataToUpdate.observacion = observacion;

  if (jaula_id !== undefined) {
    await validateJaula(jaula_id, granja_id);
    dataToUpdate.jaula = { connect: { id: Number(jaula_id) } };
  }
  if (raza_id !== undefined) {
    await validateRaza(raza_id, granja_id);
    dataToUpdate.raza = { connect: { id: Number(raza_id) } };
  }

  return await prisma.berraco.update({ where: { id: id }, data: dataToUpdate });
};

const validateJaula = async (jaula_id, granja_id) => {
  const jaula = await prisma.jaula.findFirst({
    where: { id: Number(jaula_id), activo: true, granja_id: Number(granja_id) },
  });
  if (!jaula) {
    throw new AppError("JAULA_NOT_FOUND", 404);
  }
  if (!jaula.disponible) {
    throw new AppError("JAULA_NOT_AVAILABLE", 400);
  }
  return jaula;
};

const validateRaza = async (raza_id, granja_id) => {
  const raza = await prisma.raza.findFirst({
    where: { id: Number(raza_id), activo: true, granja_id: Number(granja_id) },
  });
  if (!raza) {
    throw new AppError("RAZA_NOT_FOUND", 404);
  }
  return raza;
};

const validateBerracoName = async (nombre, granja_id) => {
  const existingBerraco = await prisma.berraco.findFirst({
    where: { nombre: nombre, granja_id: Number(granja_id) },
  });
  if (existingBerraco) {
    throw new AppError("BERRACO_NAME_EXISTS", 400);
  }
  return existingBerraco;
};

const validateBerracoExists = async (id, granja_id) => {
  const berraco = await prisma.berraco.findFirst({
    where: { id: id, granja_id: Number(granja_id), activo: true },
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
  if (montas.length > 0 && montas[0].fecha < fecha_ingreso) {
    throw new AppError("BERRACO_DATE_INVALID", 400);
  }
  return true;
};

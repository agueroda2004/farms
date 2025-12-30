import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createEnfermedadPreDestete = async (data, granja_id) => {
  const { nombre, observacion } = data;

  await validateEnfermedadPreDesteteExists(nombre, granja_id);

  return await prisma.enfermedad_PreDestete.create({
    data: {
      nombre,
      observacion,
      granja_id,
    },
  });
};

export const listEnfermedadPreDestete = async (granja_id) => {
  return await prisma.enfermedad_PreDestete.findMany({
    where: {
      granja_id,
    },
  });
};

export const getEnfermedadPreDesteteById = async (id, granja_id) => {
  return await prisma.enfermedad_PreDestete.findFirst({
    where: {
      id,
      granja_id,
    },
  });
};

export const updateEnfermedadPreDestete = async (id, granja_id, data) => {
  const { nombre, observacion, activo } = data;
  const dataToUpdate = {};

  if (nombre !== undefined) {
    await validateEnfermedadPreDesteteExists(nombre, granja_id);
    dataToUpdate.nombre = nombre;
  }
  if (observacion !== undefined) dataToUpdate.observacion = observacion;
  if (activo !== undefined) dataToUpdate.activo = activo;

  return await prisma.enfermedad_PreDestete.update({
    where: { id },
    data: dataToUpdate,
  });
};

export const deleteEnfermedadPreDestete = async (id, granja_id) => {
  const enfermedad = await validateEnfermedadPreDesteteExistsById(
    id,
    granja_id,
    true
  );
  if (enfermedad.muertos && enfermedad.muertos.length > 0) {
    return prisma.enfermedad_PreDestete.update({
      where: { id: id, granja_id: granja_id },
      data: { activo: false },
    });
  }
  return await prisma.enfermedad_PreDestete.delete({
    where: { id: id, granja_id: granja_id },
  });
};

const validateEnfermedadPreDesteteExists = async (nombre, granja_id) => {
  const enfermedad = await prisma.enfermedad_PreDestete.findFirst({
    where: {
      nombre,
      granja_id,
    },
  });
  if (enfermedad) {
    throw new AppError("ENFERMEDAD_PRE_DESTETE_EXISTS", 400);
  }
};

const validateEnfermedadPreDesteteExistsById = async (
  id,
  granja_id,
  withExtensions = false
) => {
  const enfermedad = await prisma.enfermedad_PreDestete.findFirst({
    where: {
      id,
      granja_id,
    },
    include: withExtensions
      ? {
          muertos: {
            take: 1,
            orderBy: { fecha: "desc" },
          },
        }
      : undefined,
  });
  if (!enfermedad) {
    throw new AppError("ENFERMEDAD_PRE_NOT_FOUND", 404);
  }
};

import prisma from "../prismaClient.js";

export const createEnfermedadPreDestete = async (data) => {
  const { nombre, observacion, granja_id } = data;
  const enfermedad = await prisma.enfermedad_PreDestete.findFirst({
    where: {
      nombre,
      granja_id,
    },
  });
  if (enfermedad) {
    throw new Error(
      "Enfermedad pre-destete is already registered in this farm."
    );
  }
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

export const getEnfermedadPreDesteteById = async (id) => {
  return await prisma.enfermedad_PreDestete.findUnique({
    where: {
      id,
    },
  });
};

export const updateEnfermedadPreDestete = async (id, data) => {
  const { nombre, observacion, activo } = data;
  const dataToUpdate = {};

  if (nombre !== undefined) dataToUpdate.nombre = nombre;
  if (observacion !== undefined) dataToUpdate.observacion = observacion;
  if (activo !== undefined) dataToUpdate.activo = activo;

  return await prisma.enfermedad_PreDestete.update({
    where: { id },
    data: dataToUpdate,
  });
};

export const deleteEnfermedadPreDestete = async (id) => {
  return await Prisma.enfermedad_PreDestete.delete({
    where: { id },
  });
};

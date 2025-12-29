import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createOperario = async (data, granja_id) => {
  const { nombre, rol, obersevacion } = data;
  return await prisma.operario.create({
    data: {
      nombre,
      rol,
      granja_id,
      obersevacion,
    },
  });
};

export const listOperarios = async (granja_id) => {
  return await prisma.operario.findMany({
    where: { granja_id },
  });
};

export const getOperarioById = async (id, granja_id) => {
  return await prisma.operario.findFirst({
    where: { id, granja_id },
  });
};

export const updateOperario = async (id, granja_id, data) => {
  const { nombre, rol, obersevacion, activo } = data;
  const dataToUpdate = {};

  await validateOperario(id, granja_id);

  if (nombre !== undefined) {
    dataToUpdate.nombre = nombre;
  }
  if (rol !== undefined) {
    dataToUpdate.rol = rol;
  }
  if (obersevacion !== undefined) {
    dataToUpdate.obersevacion = obersevacion;
  }
  if (activo !== undefined) {
    dataToUpdate.activo = activo;
  }

  return await prisma.operario.update({
    where: { id },
    data: {
      nombre,
      rol,
      obersevacion,
      activo,
    },
  });
};

export const deleteOperario = async (id, granja_id) => {
  const operario = await validateOperario(id, granja_id, true);

  if (
    operario.montas.length > 0 ||
    operario.muertos.length > 0 ||
    operario.partos.length > 0
  ) {
    return await prisma.operario.update({
      where: { id },
      data: { activo: false },
    });
  }

  return await prisma.operario.delete({
    where: { id },
  });
};

const validateOperario = async (id, granja_id, withRelations = false) => {
  const operario = await prisma.operario.findFirst({
    where: { id, granja_id, activo: true },
    include: withRelations
      ? {
          montas: {
            take: 1,
            orderBy: { id: "asc" },
          },
          muertos: {
            take: 1,
            orderBy: { id: "asc" },
          },
          partos: {
            take: 1,
            orderBy: { id: "asc" },
          },
        }
      : false,
  });
  if (!operario) {
    throw new AppError("OPERARIO_NOT_FOUND", 404);
  }
  return operario;
};
